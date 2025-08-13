// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ||
  'e527aa068eeb3d172f035281e815d6df5b1703b880003f2e928218142ffe5cfeed803d893962f588f822443ee0a9f4509d4022def0389adb78ff709b06fa7fd1';

function authenticateToken(req, res, next) {
  if (req.path.startsWith('/auth')) return next();

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
