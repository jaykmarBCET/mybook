import express from "express";
import { authVerify } from "../middlewares/auth.middleware.js";
import {
    searchFriendByUserInfo,searchPostByTitle,
    searchPostByUserInfo,getFriendByUserInfo,
    getPostByUserInfo,getProfileByUserId,
    getUserInfoByUserNameAndId,searchUserInfoByUserData
} from '../controllers/row.controller.js'


const router = express.Router()



router.use(express.json())
router.post('/get-user-info',authVerify,getUserInfoByUserNameAndId)
router.post('/get-friend-info',authVerify,getFriendByUserInfo)
router.post('/get-posts-by-user-info',authVerify,getPostByUserInfo)
router.post('/search-user-info-by-user-data',authVerify,searchUserInfoByUserData)
router.post('/search-post-title',authVerify,searchPostByTitle)
router.post('/search-post-by-user-info',authVerify,searchPostByUserInfo)
router.post('/get-profile-by-user-id',authVerify,getProfileByUserId)
router.post('/search-friend-by-user-info',authVerify,searchFriendByUserInfo)


export default router;