import express from 'express';
import { multerMiddleware } from '../middlewares/multer.js';
import { authVerify } from '../middlewares/auth.middleware.js';
import {
  addChat,
  getChats,
  deleteChat,
  updateChats
} from '../controllers/chat.controller.js';

const router = express.Router();


router.post('/',multerMiddleware.single("file"), authVerify, addChat);                
router.get('/', authVerify, getChats);                
router.put('/:chatId', authVerify, updateChats);      
router.delete('/:chatId', authVerify, deleteChat);    

export default router;
