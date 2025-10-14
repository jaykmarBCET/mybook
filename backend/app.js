import express from 'express';
// root register
import userRoot from './src/routes/user.routes.js';
import chatRoot from './src/routes/chat.routes.js';
import commentRoot from './src/routes/comment.routes.js';
import friendRoot from './src/routes/friend.routes.js';
import requestRoot from './src/routes/request.routes.js'
import commentLikeRoot from './src/routes/comment.like.routes.js';
import postLikeRoot from './src/routes/post.like.routes.js';
import postRoot from './src/routes/post.routes.js';
import { User } from './src/models/User.model.js';
import RowRoot from './src/routes/row.routes.js'
import callRoot from './src/routes/calling.route.js'
import aiRoot from './src/routes/ai.route.js'
//JWT configuration
import JWT from 'jsonwebtoken'
import ENV from 'dotenv'

ENV.config()

const app = express();
// root plugin
app.use('/profile', userRoot);
app.use('/post', postRoot);
app.use('/post-like', postLikeRoot);
app.use('/chat', chatRoot);
app.use('/comment', commentRoot);
app.use('/comment-like', commentLikeRoot);
app.use('/friend', friendRoot);
app.use('/request',requestRoot)
app.use('/row-data',RowRoot)
app.use('/call',callRoot)
app.use('/ai',aiRoot)
app.get('/email/verify', async(req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  
  const decode = JWT.verify(token,process.env.SECURE_KEY)
  if(!decode){
    return res.status(400).json({message:"Expired token"})
  }
  const user = await User.findOne({where:{id:decode.id,email:decode.email}})
  user.isVerifyToken = true;
  await user.save()
  

  console.log("Received token:", token);
  return res.status(200).json({ message: "Token received", user });
});

export { app };
