import { Op } from "sequelize";
import { Request } from "../models/Request.model.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


export const addRequest = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    const userRequestId = req.query.requestReceiver || req.params.requestReceiver;
    if (!userRequestId) {
        return res.status(400).json({ message: "userReceiver id required" })
    }
    const already = await Request.findOne({
        where: {
            [Op.or]: [
                {
                    requestedBy: user.id,
                    requestReceiver: userRequestId
                },
                {
                    requestedBy: user.id,
                    requestReceiver: userRequestId
                }
            ]
        }
    })
    if (already) {
        return res.status(200).json({ message: "already sended" })
    }
    const newRequest = await Request.create({ requestedBy: user.id, requestReceiver })
    if (!newRequest) {
        return res.status(500).json({ message: "Server issus" })
    }
    return res.status(200).json(newRequest)
})

export const getReceiverRequest = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    const getAllReceivedRequest = await Request.findAll({ where: { requestReceiver: user.id } })

    return res.status(200).json(getAllReceivedRequest)
})

export const getSendingRequest = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    const getAllSending = await Request.findAll({ where: { requestedBy: user.id } })
    return res.status(200).json(getAllSending)
})

export const cancelRequest = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" })
    }
    const requestReceiver = req.query.requestReceiver || req.params.requestReceiver;
    if (!requestReceiver) {
        return res.status(400).json({ message: "request receiver id required" })
    }
    const DeleteUserRequest = await Request.destroy({ requestedBy: user.id, requestReceiver })
    return res.status(200).json(DeleteUserRequest)
})