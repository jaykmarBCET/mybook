import express from 'express'
import { authVerify } from '../middlewares/auth.middleware.js'
import {
    likes, Dislikes,
    getLikesAndDisLikes,
    getDislikes, deleteDislikes,
    deleteLikes, toggleLikeAndDislike,
    getLikes,

} from '../controllers/comment.like.controller.js'


const router = express.Router();

router.post("/add-like", authVerify, likes)
router.get('/get-likes', authVerify, getLikes)
router.post("add-dislike", authVerify, Dislikes)
router.get('/get-dislikes', authVerify, getDislikes)
router.get('/get-like-and-dislikes', authVerify, getLikesAndDisLikes)
router.get('/toggle-like-dislike', toggleLikeAndDislike)
router.delete('/delete-dislike', authVerify, deleteDislikes)
router.delete('/delete-lik', authVerify, deleteLikes)

export default router;