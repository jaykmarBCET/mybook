import { Posts } from '../models/Post.model.js'
import {asyncHandler} from '../utils/AsyncHandler.js'
import {uploadStreamData} from '../utils/Cloudinary.js'
import axios from 'axios'



export const generatorImage = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
  
    const { prompt, model, width, height, title, description } = req.body;
  
    if (!prompt?.trim() || !title || !description) {
      return res.status(400).json({ message: "Prompt, title, and description are required." });
    }
  
    
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      params: { model, width, height },
      responseType: "arraybuffer",
    });
    const result = await uploadStreamData(response.data);
  
    const newPost = await Posts.create({
      postedBy: user.id,
      images: [JSON.stringify(result)],
      description,
      title,
      nologo:true
    });
  
    return res.status(200).json(newPost);
  });
  