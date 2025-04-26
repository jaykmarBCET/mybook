import express from 'express';
import {
    createComment,
    getComments,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';
import { authVerify } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(express.json({limit:"2000bytes"}))
router.post('/', authVerify, createComment);
router.get('/', authVerify, getComments);
router.put('/:commentId', authVerify, updateComment);
router.delete('/:commentId', authVerify, deleteComment);


export default router;
