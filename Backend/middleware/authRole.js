
module.exports = function authRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRole = req.user.role.toLowerCase();

    if (Array.isArray(role)) {
      const allowed = role.map(r => r.toLowerCase());
      if (!allowed.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      if (userRole !== role.toLowerCase()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    next();
  };
};
