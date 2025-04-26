import JWT from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import ENV from 'dotenv'
ENV.config()

export const authVerify = asyncHandler(async (req, res, next) => {
 
  
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized request: Token missing' });
  }
  

  
  let decoded;
  try {
    decoded = JWT.verify(token, process.env.SECURE_KEY);
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }

  
  const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  req.user = user;
  next();
});
