import {authVerify} from '../middlewares/auth.middleware.js'
import { generatorImage } from '../controllers/ai.controller.js'
import express from 'express'

const router = express.Router()

router.post('/generate-image',authVerify,generatorImage)

export default router;