import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Bearer token structure
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Extract the user details without the password field and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
