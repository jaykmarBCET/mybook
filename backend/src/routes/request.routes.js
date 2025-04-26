import express from 'express'
import {authVerify} from '../middlewares/auth.middleware.js'
import { addRequest, cancelRequest, getReceiverRequest, getSendingRequest } from '../controllers/request.controller.js'


const router = express.Router()

router.post('/friend-request',authVerify,addRequest)
router.get('/get-receiver-request',authVerify,getReceiverRequest)
router.get('/get-sending-request',authVerify,getSendingRequest)
router.delete('cancel-friend-request',authVerify,cancelRequest)

export default router