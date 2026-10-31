const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Validates that requests originate from the trusted Next.js BFF layer
 * using a shared cryptographic secret via the X-Internal-Secret header.
 * Direct external requests bypassing the Next.js gateway are blocked.
 */
const verifyInternalSecret = (req, res, next) => {
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret) {
    console.error('INTERNAL_API_SECRET is not configured on the backend server.');
    return res.status(500).json({ message: 'Internal server configuration error' });
  }

  const clientSecret = req.headers['x-internal-secret'];

  if (!clientSecret || typeof clientSecret !== 'string') {
    return res.status(403).json({ message: 'Forbidden: Direct API access is not permitted' });
  }

  const expectedBuffer = Buffer.from(secret, 'utf8');
  const actualBuffer = Buffer.from(clientSecret, 'utf8');

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    return res.status(403).json({ message: 'Forbidden: Invalid internal API credentials' });
  }

  return next();
};

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
  verifyInternalSecret,
  verifyToken,
  authorizeRoles,
};
