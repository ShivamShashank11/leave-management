
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');


router.get('/admin-dashboard', auth, authRole('Admin'), (req, res) => res.send('Welcome Admin!'));


router.post('/', auth, authRole('Employee'), leaveController.applyLeave);
router.get('/my', auth, authRole('Employee'), leaveController.getMyLeaves);
router.put('/cancel/:id', auth, authRole('Employee'), leaveController.cancelLeave);


router.get('/', auth, authRole(['Admin', 'HR']), leaveController.getAllLeaves);
router.put('/approve/:id', auth, authRole(['Admin', 'HR']), leaveController.approveLeave);
router.put('/reject/:id', auth, authRole(['Admin', 'HR']), leaveController.rejectLeave);

module.exports = router;

