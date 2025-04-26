import { asyncHandler } from '../utils/AsyncHandler.js';
import { Chat } from '../models/Chat.model.js';
import { dataUpload } from '../utils/Cloudinary.js';
import { Op, where } from 'sequelize'; 
import { getReceiverSocketId,io } from '../../socket.js';
export const addChat = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    const { description } = req.body;
    const file_path = req?.file?.path;
    const receiver = req.query.receiver || req.params.receiver;

    if (!(description || file_path)) {
        return res.status(400).json({ message: "File or description is required" });
    }

    if (!receiver) {
        return res.status(400).json({ message: "Receiver is required as params or query" });
    }

    let holdFileInfo = null;
    if (file_path) {
        holdFileInfo = await dataUpload(file_path);
    }

    const newChat = await Chat.create({
        file: holdFileInfo?.url || null,
        fileId: holdFileInfo?.publicId || null,
        chatSender: user.id,
        chatReceiver: receiver,
        description
    });
    const socketId = getReceiverSocketId(receiver)
    if(socketId){
        io.to(socketId).emit('newMessage',newChat)
    }
    if (!newChat) {
        return res.status(500).json({ message: "Server issue while sending chat" });
    }

    return res.status(200).json(newChat);
});


export const getChats = asyncHandler(async (req, res) => {
    const user = req.user;
    const receiver = req.query.receiver || req.params.receiver;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    if (!receiver) {
        return res.status(400).json({ message: "Receiver ID is required" });
    }

    const allChats = await Chat.findAll({
        where: {
            [Op.or]: [
                { chatSender: user.id, chatReceiver: receiver },
                { chatSender: receiver, chatReceiver: user.id }
            ]
        },
        order: [['createdAt', 'ASC']]
    });

    if (!allChats || allChats.length === 0) {
        return res.status(200).json({ message: "No chats available" });
    }

    return res.status(200).json(allChats);
});


export const updateChats = asyncHandler(async (req, res) => {
    const user = req.user;
    const { description } = req.body;
    const chatId = req.query.chatId || req.params.chatId;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    if (!chatId || !description) {
        return res.status(400).json({ message: "All fields required" });
    }

    const [updated] = await Chat.update(
        { description },
        { where: { id: chatId, chatSender: user.id } }
    );

    if (!updated) {
        return res.status(404).json({ message: "Chat not found or not updated" });
    }

    return res.status(200).json({ message: "Chat updated successfully" });
});

export const deleteChat = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"Unauthorized request"})
    }
    const chatId = req.query.chatId || req.params.chatId;
    if(!chatId){
        return res.status(400).json({message:"chatId required as query or params"})
    }

    const chat = await Chat.destroy({where:{id:chatId}})
    return res.status(200).json(chat)
})
