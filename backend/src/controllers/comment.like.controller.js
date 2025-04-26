import {asyncHandler}  from '../utils/AsyncHandler.js'
import { CommentsDislike,CommentsLike } from '../models/Comment.like.model.js'


export const likes = asyncHandler(async(req,res)=>{
       const user  = req.user;
       if(!user){
        return res.status(401).json({message:'unauthorized request'})
       }
       const {commentId} = req.query
       if(!commentId){
        return res.status(400).json({message:"commentId id required"})
       }
       const alreadyLiked = await CommentsLike.findOne({where:{commentId:commentId,likedBy:user.id}})
       if(alreadyLiked){
        return res.status(200).json({message:'already liked'})
       }
       const newLike = await CommentsLike.create({
         commentId,
         likedBy:user.id,
       })
       if(!newLike){
        return res.status(500).json({message:"serve issus"})
       }
      await CommentsDislike.destroy({where:{dislikedBy:user.id,commentId}})
       return res.status(200).json(newLike)
})

export const Dislikes = asyncHandler(async(req,res)=>{
       const user  = req.user;
       if(!user){
        return res.status(401).json({message:'unauthorized request'})
       }
       const {commentId} = req.query
       if(!commentId){
        return res.status(400).json({message:"commentId required"})
       }
       const alreadyDisliked= await CommentsDislike.findOne({where:{commentId:commentId,dislikedBy:user.id}})
       if(alreadyDisliked){
        return res.status(200).json({message:'already disliked'})
       }
       const newDislike = await CommentsDislike.create({
         commentId,
         likedBy:user.id,
       })
       if(!newDislike){
        return res.status(500).json({message:"serve issus"})
       }
       await CommentsLike.destroy({where:{likedBy:user.id,commentId}})
       return res.status(200).json(newDislike)
})

export const getLikesAndDisLikes = asyncHandler(async(req,res)=>{
    const user = req.user
    if(!user){
        return res.status({message:'Unauthorized request'})
    }
    const commentId = req.query || req.params 
    if(!commentId){
        return res.status(200).json({message:"commentId required"})
    }
    const allLikes = await CommentsLike.count({where:{commentId:commentId}})
    const allDisLikes = await CommentsDislike.count({where:{commentId:commentId}})
    const dislikeObject = await  CommentsDislike.findAll({where:{commentId:commentId}})
    const likesObject = await CommentsLike.findAll({where:{commentId:commentId}})
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
    const commentId = req.query.commentId || req.params.commentId;
    if(!commentId)return res.status(400).json({message:"commentId required"})
    const allLikes = await CommentsLike.findAll({where:{commentId:commentId}})
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
    const commentId = req.query.commentId || req.params.commentId;
    if(!commentId)return res.status(400).json({message:"commentId required"})
    const allDislikes = await CommentsDislike.findAll({where:{commentId:commentId}})
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
    const commentId = req.query.commentId || res.params.commentId
    if(!commentId)return res.status(400).json({message:"commentId required"})
    const existLike = await CommentsLike.findOne({where:{likedBy:user.id,commentId:commentId}})
    if(existLike){
        await CommentsDislike.create({commentId,dislikedBy:user.id})
        await CommentsLike.destroy({where:{commentId,likedBy:user.id}})
    }else{
        await CommentsLike.create({commentId,likedBy:user.id})
        await CommentsDislike.destroy({where:{commentId,dislikedBy:user.id}})
    }
    const likes = await CommentsLike.count({where:{commentId}})
    const disliked = await CommentsDislike.count({where:{commentId}})

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
    const commentId = req.query.commentId || req.params.commentId
    if(!commentId){
        return res.status(400).json({message:"post id required"})
    }
    const resetLike = await CommentsLike.destroy({where:{commentId,likedBy:user.id}})
    if(!resetLike){
        return res.status(200).json({message:'like object not found'})
    }
    const allLikes = await CommentsLike.count({where:{commentId,likedBy:user.id}})
    return res.status(200).json(allLikes)
})
export const deleteDislikes = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"unauthorized request"})
    }
    const commentId = req.query.commentId || req.params.commentId
    if(!commentId){
        return res.status(400).json({message:"post id required"})
    }
    const resetLike = await CommentsDislike.destroy({where:{commentId,dislikedBy:user.id}})
    if(!resetLike){
        return res.status(200).json({message:'dislike object not found'})
    }
    const allDislikes = await CommentsDislike.count({where:{commentId,dislikedBy:user.id}})
    return res.status(200).json(allDislikes)
})



