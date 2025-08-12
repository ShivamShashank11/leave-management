
const Leave = require('../models/Leave');
const User = require('../models/User');

function daysBetweenInclusive(startDate, endDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = end - start;
  return Math.ceil(diff / msPerDay) + 1;
}

function normalizeDate(dateLike) {
  const d = new Date(dateLike);
  if (isNaN(d)) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}


exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate: startRaw, endDate: endRaw, reason } = req.body;

    if (!leaveType || !startRaw || !endRaw || !reason) {
      return res.status(400).json({ message: 'All fields required: leaveType, startDate, endDate, reason' });
    }

    const start = normalizeDate(startRaw);
    const end = normalizeDate(endRaw);
    if (!start || !end) return res.status(400).json({ message: 'Invalid date(s) provided' });

    if (end < start) return res.status(400).json({ message: 'End date cannot be before start date' });

    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (start < today) return res.status(400).json({ message: 'Cannot apply leave for past dates' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.joiningDate) {
      const joining = normalizeDate(user.joiningDate);
      if (joining && start < joining) return res.status(400).json({ message: 'Cannot apply leave before joining date' });
    }

    const requestedDays = daysBetweenInclusive(start, end);
    const available = typeof user.leaveBalance === 'number' ? user.leaveBalance : 0;
    if (requestedDays > available) return res.status(400).json({ message: 'Not enough leave balance' });

    // overlap: existing.start <= newEnd && existing.end >= newStart
    const overlappingLeave = await Leave.findOne({
      user: req.user.id,
      status: { $in: ['Pending', 'Approved'] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlappingLeave) return res.status(400).json({ message: 'Overlapping leave request exists for the selected dates' });

    const newLeave = new Leave({
      user: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending'
    });

    await newLeave.save();
    return res.status(201).json({ message: 'Leave applied successfully', leave: newLeave });
  } catch (err) {
    console.error('Apply Leave Error:', err);
    return res.status(500).json({ message: 'Server error applying for leave', error: err.message });
  }
};


exports.getMyLeaves = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('leaveBalance name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ user: { name: user.name, email: user.email, leaveBalance: user.leaveBalance }, leaves });
  } catch (err) {
    console.error('Get My Leaves Error:', err);
    return res.status(500).json({ message: 'Error fetching your leaves', error: err.message });
  }
};


exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('user', 'name email department joiningDate leaveBalance')
      .sort({ createdAt: -1 });

    return res.json(leaves);
  } catch (err) {
    console.error('Get All Leaves Error:', err);
    return res.status(500).json({ message: 'Error fetching leaves', error: err.message });
  }
};


exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('user');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.status !== 'Pending') return res.status(400).json({ message: 'Leave already processed' });

    
    const overlapExists = await Leave.findOne({
      user: leave.user._id,
      _id: { $ne: leave._id },
      status: 'Approved',
      startDate: { $lte: leave.endDate },
      endDate: { $gte: leave.startDate }
    });
    if (overlapExists) return res.status(400).json({ message: 'An overlapping approved leave exists' });

    const requestedDays = daysBetweenInclusive(leave.startDate, leave.endDate);
    const available = typeof leave.user.leaveBalance === 'number' ? leave.user.leaveBalance : 0;
    if (requestedDays > available) return res.status(400).json({ message: 'Insufficient leave balance to approve' });

    leave.user.leaveBalance = available - requestedDays;
    await leave.user.save();

    leave.status = 'Approved';
    await leave.save();

    return res.json({ message: 'Leave approved', leave });
  } catch (err) {
    console.error('Approve Leave Error:', err);
    return res.status(500).json({ message: 'Error approving leave', error: err.message });
  }
};


exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.status !== 'Pending') return res.status(400).json({ message: 'Leave already processed' });

    leave.status = 'Rejected';
    await leave.save();

    return res.json({ message: 'Leave rejected', leave });
  } catch (err) {
    console.error('Reject Leave Error:', err);
    return res.status(500).json({ message: 'Error rejecting leave', error: err.message });
  }
};


exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({ _id: req.params.id, user: req.user.id });
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (leave.status === 'Pending') {
      leave.status = 'Cancelled';
      await leave.save();
      return res.json({ message: 'Leave cancelled', leave });
    }

    if (leave.status === 'Approved') {
      
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found to restore balance' });

      const requestedDays = daysBetweenInclusive(leave.startDate, leave.endDate);
      user.leaveBalance = (user.leaveBalance ?? 0) + requestedDays;
      await user.save();

      leave.status = 'Cancelled';
      await leave.save();

      return res.json({ message: 'Approved leave cancelled and balance restored', leave });
    }

    return res.status(400).json({ message: 'Only pending or approved leaves can be cancelled' });
  } catch (err) {
    console.error('Cancel Leave Error:', err);
    return res.status(500).json({ message: 'Error cancelling leave', error: err.message });
  }
};
