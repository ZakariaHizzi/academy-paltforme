const jwt = require('jsonwebtoken');

// NOTE: verifyInternalSecret (X-Internal-Secret header check) has been removed.
// The API no longer requires a shared internal secret for direct access.

/**
 * Validates the JWT Bearer token provided in the Authorization header.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token has expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token verification failed' });
  }
};

/**
 * Enforces role-based access control against the authenticated user's role.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    return next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
};
