import { Friends } from "../models/Friends.model.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { Request } from '../models/Request.model.js';
import { Op } from "sequelize";
import {User} from '../models/User.model.js'

export const addFriend = asyncHandler(async (req, res) => {
    const user = req.user;
    const requestId = req.query.requestId || req.params.requestId;

    if (!requestId) {
        return res.status(400).json({ message: 'Request ID is required' });
    }

    const alreadyExists = await Friends.findOne({
        where: {
            [Op.or]:[
                {
                    friendBy: requestId,
                    userId: user.id
                },
                {
                    friendBy: user.id,
                    userId: requestId
                }
            ]
        }
    });

    if (alreadyExists) {
        return res.status(400).json({ message: 'Already friends' });
    }

    const requestedUser = await Request.findOne({
        where: {
            [Op.or]:[
                {
                    requestedBy: requestId,
                    requestReceiver: user.id
                },
                {
                    requestedBy: user.id,
                    requestReceiver: requestId
                }
            ]
        }
    });

    if (!requestedUser) {
        return res.status(400).json({ message: "Invalid request ID" });
    }

    requestedUser.isAccept = true;
    await requestedUser.save({ validate: false });

    const newFriends = await Friends.create({
        friendBy: requestId,
        userId: user.id
    });

    return res.status(200).json(newFriends);
});

export const remove = asyncHandler(async (req, res) => {
    const user = req.user;
    const friendId = req.query.friendId || req.params.friendId;

    if (!friendId) {
        return res.status(400).json({ message: "Friend ID is required" });
    }

    
    const deleted = await Friends.destroy({
        where: {
            [Op.or]:[
                {
                    friendBy: friendId,
                    userId: user.id
                },
                {
                    friendBy: friendId,
                    userId: user.id
                }
            ]
        }
    });

    if (!deleted) {
        return res.status(404).json({ message: "Friend not found" });
    }

    await Request.destroy({
        where: {
            [Op.or]:[
                {
                    requestedBy: friendId,
                    requestReceiver: user.id
                },
                {
                    requestedBy: user.id,
                     requestReceiver: friendId
                }
            ]
        }
    });

    return res.status(200).json({ message: "Friend and request removed successfully" });
});

export const sendRequest = asyncHandler(async (req, res) => {
    const user = req.user;
    const receiverId = req.query.receiverId || req.params.receiverId;

    if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (receiverId === user.id) {
        return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const alreadySent = await Request.findOne({
        where: {
            [Op.or]:[
                {
                    requestedBy: user.id,
                    requestReceiver: receiverId
                },
                {
                    requestedBy: receiverId,
                    requestReceiver: user.id
                }
            ]
        }
    });

    if (alreadySent) {
        return res.status(400).json({ message: "Request already sent" });
    }

    const newRequest = await Request.create({
        requestedBy: user.id,
        requestReceiver: receiverId,
        isAccept: false
    });

    return res.status(200).json(newRequest);
});



export const getAllRequests = asyncHandler(async (req, res) => {
    const user = req.user;

    const requests = await Request.findAll({
        where: { requestReceiver: user.id, isAccept: false }
    });

    return res.status(200).json(requests);
});


export const getAllFriends = asyncHandler(async (req, res) => {
    const user = req.user;

    const friends = await Friends.findAll({
        where: {
            [Op.or]: [
                { userId: user.id },
                { friendBy: user.id }
            ]
        }
    });

  

    return res.status(200).json(friends);
});


export const getUserInfo = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: "userId required" });
    }

    const userInfo = await User.findOne({
        where: { id: userId },
        attributes: ["id", "avatar", "name"]  // corrected from 'attribute' to 'attributes'
    });

    if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userInfo);
});
