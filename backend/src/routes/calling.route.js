import express from 'express';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { authVerify } from '../middlewares/auth.middleware.js';
import { io, getReceiverSocketId } from '../../socket.js';

const router = express.Router();

router.post(
  '/start-calling',
  authVerify,
  asyncHandler((req, res) => {
    const fromUser = req.user;
    const { userId, offer, type = 'video' } = req.body;

    if (!userId || !offer) {
      return res.status(400).json({ success: false, message: 'Missing userId or offer' });
    }

    const socketId = getReceiverSocketId(userId);
    if (!socketId) {
      return res.status(404).json({ success: false, message: 'User is offline' });
    }

    console.log(`[CALL] ${fromUser.name} is calling userId=${userId} (type: ${type})`);

    io.to(socketId).emit('offer', {
      offer,
      from: fromUser.id,
      name: fromUser.name,
      avatar: fromUser.avatar,
      type,
    });

    res.status(200).json({ success: true, message: 'Offer sent' });
  })
);

// ❌ End a call (Send call-ended to receiver)
router.post(
  '/close-call',
  authVerify,
  asyncHandler((req, res) => {
    const fromUser = req.user;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const socketId = getReceiverSocketId(userId);
    if (socketId) {
      console.log(`[CALL] ${fromUser.name} ended call with userId=${userId}`);
      io.to(socketId).emit('call-ended', {
        from: fromUser.id,
      });
    }

    res.status(200).json({ success: true, message: 'Call closed' });
  })
);

export default router;
