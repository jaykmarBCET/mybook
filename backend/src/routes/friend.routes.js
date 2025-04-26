import express from 'express';
import {
    addFriend,
    remove,
    sendRequest,
    getAllRequests,
    getAllFriends,
    getUserInfo
} from '../controllers/friend.controller.js';
import { authVerify } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send-request/:receiverId', authVerify, sendRequest);
router.post('/add/:requestId', authVerify, addFriend);
router.delete('/remove/:friendId', authVerify, remove);
router.get('/requests', authVerify, getAllRequests);
router.get('/all', authVerify, getAllFriends);
router.get('/get-user-info',authVerify,getUserInfo)
export default router;
