import express from 'express'
import { authVerify } from '../middlewares/auth.middleware.js';
import { multerMiddleware } from '../middlewares/multer.js';
import { 
    login,register,updateProfile,
    verifyUser,createVerificationUrl,
    currentUser,logout,deleteCurrentUser,
    deleteVerify,recoveryUser,recoveryVerify,resetPassword,resetPasswordVerify
 }
     from '../controllers/Users.controller.js';

const router = express.Router();

router.put('/update-profile', authVerify,multerMiddleware.fields([
    {
        name:"avatar",
        maxCount:1,
    },
    {
        name:"coverImage",
        maxCount:1,
    }
]),updateProfile)
router.use(express.json())
router.post('/register',register)
router.post("/login",login)
router.post('/recover-user',recoveryUser)
router.post('/reset-password',resetPassword)
router.post('/reset-password-verify',resetPasswordVerify)
router.post('/verify-user',verifyUser)
router.use(authVerify)
router.post('/create-register-verify',createVerificationUrl)
router.get('/current-user',currentUser)
router.get('/logout',logout);
router.delete('/delete-current-user',deleteCurrentUser)
router.post('/delete-verify',deleteVerify)
router.post('/recover-user-verify',recoveryVerify)

export default router