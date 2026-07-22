const jwt = require('jsonwebtoken');

// Verifies the JWT sent in the Authorization header and attaches the user id/role to req.user
function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
}

// Restrict a route to a specific role, e.g. requireRole('lawyer')
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Only ${role}s can do this` });
    }
    next();
  };
}

module.exports = { protect, requireRole };
