import JWT from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import ENV from 'dotenv';
ENV.config();

export const authVerify = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized request: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JWT.verify(token, process.env.SECURE_KEY);

    const user = await User.findOne({
      where: { id: decoded.id, email: decoded.email },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
});
