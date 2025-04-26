import { Op } from 'sequelize';
import { Posts } from '../models/Post.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import {PostDislikes,PostLikes} from '../models/Post.like.model.js'
import {Comments} from '../models/Comment.model.js'
import {
  dataUpload,
  deleteData,
  ImageUpload,
  VideoUpload,
} from '../utils/Cloudinary.js';


export const addPostImage = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  const user = req.user;

  if (!file || !title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const response = await dataUpload(file.path);
  if (!response) {
    return res.status(501).json({ message: "Server issue while uploading file" });
  }

  const newPost = await Posts.create({
    postedBy: user.id,
    images: [JSON.stringify(response)],
    description,
    title,
    isPublic: true,
  });

  if (!newPost) {
    return res.status(500).json({ message: "Server issue while creating post" });
  }

  return res.status(200).json(newPost);
});

export const addMutiplePostImage = asyncHandler(async (req, res) => {
  const user = req.user;
  const { title, description } = req.body;
  const files = req.files;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "Images are required" });
  }

  const upload_url_and_public_id = await Promise.all(
    files.map(async (file) => {
      const response = await ImageUpload(file.path);
      return { url: response.url, public_id: response.publicId };
    })
  );

  const newPost = await Posts.create({
    title,
    description,
    postedBy: user.id,
    images: upload_url_and_public_id,
  });

  if (!newPost) {
    return res.status(500).json({ message: "Server issue while creating post" });
  }

  return res.status(200).json(newPost);
});

export const addPostVideo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { title, description } = req.body;
  const file = req.file;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  const response = await VideoUpload(file.path);
  if (!response.publicId) {
    return res.status(500).json({ message: "Server issue while uploading video" });
  }

  const newPost = await Posts.create({
    title,
    description,
    postedBy: user.id,
    videos: [response],
  });

  if (!newPost) {
    return res.status(500).json({ message: "Server issue while creating post" });
  }

  return res.status(200).json(newPost);
});

export const addMutiplePostVideo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { title, description } = req.body;
  const files = req.files;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "Videos are required" });
  }

  const upload_url_and_public_id = await Promise.all(
    files.map(async (file) => {
      const response = await VideoUpload(file.path);
      return { url: response.url, public_id: response.publicId };
    })
  );

  const newPost = await Posts.create({
    title,
    description,
    postedBy: user.id,
    videos: upload_url_and_public_id,
  });

  if (!newPost) {
    return res.status(500).json({ message: "Server issue while creating post" });
  }

  return res.status(200).json(newPost);
});

export const getPost = asyncHandler(async (req, res) => {
  const user = req.user;
  const page = req?.query?.page;


  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const posts = await Posts.findAll({ limit: Number(page == undefined || page <= 0 ? 20 : (page * 20)), order:[["createdAt","desc"]] });

  if (!posts || posts.length === 0) {
    return res.status(200).json({ message: "No posts yet" });
  }

  return res.status(200).json(posts);
});

export const getOnlyVideo = asyncHandler(async (req, res) => {
  const user = req.user;
  const page = req?.query?.page

  if (!user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const videoPosts = await Posts.findAll({
    where: {
      postedBy: user.id,
      videos: {
        [Op.ne]: null,
      },
    },
    limit: Number(page == undefined || page <= 0 ? 20 : (page * 20))

  });

  if (!videoPosts || videoPosts.length === 0) {
    return res.status(200).json({ message: "No video posts yet" });
  }

  return res.status(200).json(videoPosts);
});

export const updateImage = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized request' })
  }
  const { postId,publicId } =  req.query || req.params
  const  file_path = req.file.path;
  if(!postId || !publicId || !file_path){
    return res.status(400).json({message:"all field required"})
  }
  const postObject = await Posts.findOne({where:{id:postId,postedBy:user.id}})
   if(!postObject){
    return res.status(404).json({message:"post not found"})
   }
   const uploadObject = await ImageUpload(file_path)
   if(!uploadObject){
    return res.status(500).json({message:"something went wrong while uploading image"})
   }
   let images = postObject.images
    images = images.filter((item)=>JSON.parse(item).public_id!==publicId)
    images.push(JSON.stringify(uploadObject))
    console.log(images)
    postObject.images = images;
    await postObject.save({validate:false})

   return res.json(postObject)
})

export const updateTitleAndDescription = asyncHandler(async(req,res)=>{
    const user = req.user;
    const postId = req.query.postId;
    if(!user){
      return res.status(401).json({message:"unauthorized request"})
    }
     const {title,description} = req.body;
     if(!title || !description){
      return res.status(400).json({message:"all field required"})
     }
     if(!postId){
      return res.status(400).json({message:"make sure post id required"})
     }
     const isowner = await Posts.findOne({where:{postedBy:user.id,id:postId}})
     if(!isowner){
      return res.status(400).json({message:"Only change by post owner"})
     }
     const updateObject = await Posts.findOne({where:{id:postId}})
     if(!updateObject){
      return res.status(400).json({message:"server issus while fetching post data"})
     }
     updateObject.title = title;
     updateObject.description = description;
     updateObject.save({validate:false})

     return res.status(200).json(updateObject)
})

export const updateVideoPost = asyncHandler(async(req,res)=>{
      const user = req?.file?.path
      if(!user){
        return res.status(401).json({message:"Unauthorized request"})
      }
      const videoFilePath = req.file?.path;
      const {postId,publicId} = rew.query || req.params
      if(!videoFilePath){
        return res.status(400).json({message:"video required"})
      }
      if(!postId || !publicId){
        return res.status(400).json({message:"postId and publicId required as params or query"})
      }
      const existsVideo = await Posts.findOne({where:{id:postId,postedBy:user.id}})
      if(!existsVideo){
        return res.status(404).json({message:"not found"})
      }
      const uploadVideo = await VideoUpload(videoFilePath);
      if(!uploadVideo.publicId){
        return res.status(500).json({message:"something went wrong while uploading video, please try again"})
      }
      let videos = existsVideo.videos;
      let previousVideo = videos.find((item)=>JSON.parse(item).public_id===publicId)
      if(!previousVideo){
        return res.status(400).json({message:"public id invalid"})
      }
      await deleteData(previousVideo.publicId)
      videos = videos.filter((item)=>item.publicId!==publicId)
      videos.push(uploadVideo)
      existsVideo.videos = videos;
      existsVideo.save({validate:false})
      return res.status(200).json(existsVideo)
})

export const deletePost = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    const { postId } = req.query || req.params;
    if (!postId) {
      return res.status(400).json({ message: "postId required in query or params" });
    }

    const existsPost = await Posts.findOne({ where: { id: postId, postedBy: user.id } });
    if (!existsPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const deleteMedia = async (mediaArray) => {
      for (const item of mediaArray || []) {
        try {
          const publicId = JSON.parse(item).publicId;
          await deleteData(publicId);
        } catch (err) {
          console.error('Failed to delete media item:', err);
        }
      }
    };

    await deleteMedia(existsPost.images);
    await deleteMedia(existsPost.videos);

    
    PostDislikes.destroy({where:{
      postId
    }})
    PostLikes.destroy({where:{
      postId
    }})
    Comments.destroy({where:{
      postId
    }})
    

    const deletePostObject = await Posts.destroy({
      where: { id: postId, postedBy: user.id }
    });

    if (!deletePostObject) {
      return res.status(500).json({ message: "Failed to delete post" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ message: "Server error while deleting post", error: error.message });
  }
});
