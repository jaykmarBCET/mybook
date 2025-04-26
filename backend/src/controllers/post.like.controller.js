import {PostLikes} from '../models/Post.like.model.js'
import { PostDislikes } from '../models/Post.like.model.js'
import {asyncHandler}  from '../utils/AsyncHandler.js'


export const likes = asyncHandler(async(req,res)=>{
       const user  = req.user;
       if(!user){
        return res.status(401).json({message:'unauthorized request'})
       }
       const {postId} = req.query
       if(!postId){
        return res.status(400).json({message:"post id required"})
       }
       const alreadyLiked = await PostLikes.findOne({where:{postId:postId,likedBy:user.id}})
       if(alreadyLiked){
           return res.status(200).json({message:'already liked'})
        }
        const newLike = await PostLikes.create({
            postId,
            likedBy:user.id,
        })
        if(!newLike){
            return res.status(500).json({message:"serve issus"})
        }
        await PostDislikes.destroy({where:{postId,dislikedBy:user.id}})
       return res.status(200).json(newLike)
})

export const Dislikes = asyncHandler(async(req,res)=>{
       const user  = req.user;
       if(!user){
        return res.status(401).json({message:'unauthorized request'})
       }
       const {postId} = req.query
       if(!postId){
        return res.status(400).json({message:"post id required"})
       }
       const alreadyDisliked= await PostDislikes.findOne({where:{postId:postId,dislikedBy:user.id}})
       if(alreadyDisliked){
        return res.status(200).json({message:'already disliked'})
       }
       const newDislike = await PostDislikes.create({
         postId,
         dislikedBy:user.id,
       })
       if(!newDislike){
           return res.status(500).json({message:"serve issus"})
        }
        await PostLikes.destroy({where:{postId,likedBy:user.id}})
       return res.status(200).json(newDislike)
})

export const getLikesAndDisLikes = asyncHandler(async(req,res)=>{
    const user = req.user
    if(!user){
        return res.status({message:'Unauthorized request'})
    }
    const {postId} = req.query || req.params 
    if(!postId){
        return res.status(200).json({message:"postId required"})
    }
    const allLikes = await PostLikes.count({where:{postId:postId}})
    const allDisLikes = await PostDislikes.count({where:{postId:postId}})
    const dislikeObject = await  PostDislikes.findAll({where:{postId:postId}})
    const likesObject = await PostLikes.findAll({where:{postId:postId}})
    return res.status(200).json({
        likes:allLikes,
        dislikes:allDisLikes,
        dislikeUser:dislikeObject,
        likesUser: likesObject
    })
})

export const getLikes = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"Unauthorized request"})
    }
    const postId = req.query.postId || req.params.postId;
    if(!postId)return res.status(400).json({message:"postId required"})
    const allLikes = await PostLikes.findAll({where:{postId:postId}})
    return res.status(200).json({
        likes:allLikes.length,
        likesUser:allLikes
    })
})
export const getDislikes = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"Unauthorized request"})
    }
    const postId = req.query.postId || req.params.postId;
    if(!postId)return res.status(400).json({message:"postId required"})
    const allDislikes = await PostDislikes.findAll({where:{postId:postId}})
    return res.status(200).json({
        dislikes:allDislikes.length,
        dislikesUser:allDislikes
    })
})

export const toggleLikeAndDislike = asyncHandler(async(req,res)=>{
    const user = req.user ;
    if(!user){
        return res.status(401).json({message:'unauthorized request'})
    }
    const postId = req.query.postId || res.params.postId
    if(!postId)return res.status(400).json({message:"postId required"})
    const existLike = await PostLikes.findOne({where:{likedBy:user.id,postId:postId}})
    if(existLike){
        await PostDislikes.create({postId,dislikedBy:user.id})
        await PostLikes.destroy({where:{postId,likedBy:user.id}})
    }else{
        await PostLikes.create({postId,likedBy:user.id})
        await PostDislikes.destroy({where:{postId,dislikedBy:user.id}})
    }
    const likes = await PostLikes.count({where:{postId}})
    const disliked = await PostDislikes.count({where:{postId}})

    return res.status(200).json({
        likes,
        disliked
    })
})

export const deleteLikes = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"unauthorized request"})
    }
    const postId = req.query.postId || req.params.postId
    if(!postId){
        return res.status(400).json({message:"post id required"})
    }
    const resetLike = await PostLikes.destroy({where:{postId,likedBy:user.id}})
    if(!resetLike){
        return res.status(200).json({message:'like object not found'})
    }
    const allLikes = await PostLikes.count({where:{postId,likedBy:user.id}})
    return res.status(200).json(allLikes)
})
export const deleteDislikes = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"unauthorized request"})
    }
    const postId = req.query.postId || req.params.postId
    if(!postId){
        return res.status(400).json({message:"post id required"})
    }
    const resetLike = await PostDislikes.destroy({where:{postId,dislikedBy:user.id}})
    if(!resetLike){
        return res.status(200).json({message:'dislike object not found'})
    }
    const allDislikes = await PostDislikes.count({where:{postId,dislikedBy:user.id}})
    return res.status(200).json(allDislikes)
})



