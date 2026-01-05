import jwt from 'jsonwebtoken';

export function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  const [schema, token] = authHeader.split(' ');

  if (schema !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = payload;

  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(401).json({ 
      message: 'JWT is invalid',
      error: err.message 
    });
  }

  next();
};