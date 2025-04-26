import express from 'express'
import {authVerify} from '../middlewares/auth.middleware.js'
import  {multerMiddleware} from '../middlewares/multer.js'
import {
    addMutiplePostImage,
    addPostImage,
    addMutiplePostVideo,
    addPostVideo,
    getPost,
    getOnlyVideo,
    updateImage,
    updateTitleAndDescription,
    updateVideoPost,
    deletePost
} from '../controllers/post.controller.js'

const router = express.Router();

router.post('/add-image', authVerify,multerMiddleware.single('post'),addPostImage)
router.post('/add-multiple-image',authVerify,multerMiddleware.array(),addMutiplePostImage);
router.post('/add-video',authVerify,multerMiddleware.single("post"),addPostVideo);
router.post('/add-multiple-video',authVerify,multerMiddleware.array("post"),addMutiplePostVideo)
router.get('/get-post',authVerify,getPost)
router.get('/get-only-video',authVerify,getOnlyVideo)
router.put('/update-image',authVerify,multerMiddleware.single("post"),updateImage)
router.put('/update-video',authVerify,updateVideoPost)
router.put('/update-title-description',authVerify,updateTitleAndDescription)
router.delete('/delete-post',authVerify,deletePost)

export default router;