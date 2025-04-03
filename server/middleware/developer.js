const jwt = require('jsonwebtoken');

const developer = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if(req.user.role === "developer")   next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = developer;
