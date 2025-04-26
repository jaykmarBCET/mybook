import { User } from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/GenerateToken.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { SendMail } from '../utils/SendMail.js';
import JWT from 'jsonwebtoken';
import {ImageUpload,logoImage,coverImage, logoImageByPublicId, coverImageByPublicId} from '../utils/Cloudinary.js'
import { DeletedUser } from '../models/DeleteAccount.model.js';
import { SendOtp } from '../utils/Otp.js';
import { OTP } from '../models/otp.model.js';

export const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    

    if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
        
        const existsUser = await User.findOne({ where: { email: email.toLowerCase() } });
        
        if (existsUser) {
            return res.status(400).json({ message: "User already exists" });
        }
  
   

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name, 
        email: email.toLowerCase(), 
        password: hashPassword
    });

   

    if (!newUser) {
        return res.status(500).json({ message: "Server error while creating user" });
    }

    const user = await User.findOne({
        where: { id: newUser.id },
        attributes: { exclude: ["password"] }
    });

    const token = await generateToken({ id: user.id, email: user.email });
    if (token.message) {
        return res.status(500).json({ message: "Server error while generating token" });
    }

    const verifyUrl = `${process.env.FRONTEND_URL}/email/verify?token=${token.token}`;
    await SendMail({ userEmail: user.email, url: verifyUrl });

    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        })
        .json({...user,token});
});

export const createVerificationUrl = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"not found user"})
    }
    const currentUser = await User.findOne({where:{id:user.id,email:user.email}})
    currentUser.isTokenExpireTime = Date.now()+ 10*60*1000
    await currentUser.save()
    const token = await generateToken({id:user.id,email:user.email})
    if(!token)return res.status(500).json({message:"server issus while create token"})
    const verifyUrl = `${process.FRONTEND_URL}/email/verify?token=${token}`
    await SendMail({userEmail:user.email,utl:verifyUrl})
    return res.status(200).json(user)
})
export const verifyUser = asyncHandler(async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res
            .status(400)
            .setHeader("Content-Type", "text/html")
            .send(`<h1>No token provided</h1><p>Please log in and try again.</p>`);
    }

    try {
        const decode = JWT.verify(token, process.env.SECURE_KEY);
        const user = await User.findOne({ where: { id: decode.id, email: decode.email } });

        if (!user) {
            return res
                .status(400)
                .setHeader("Content-Type", "text/html")
                .send(`<h1>User not found</h1>`);
        }

        if (new Date(user.isTokenExpireTime).getTime() < Date.now()) {
            return res
                .status(400)
                .setHeader("Content-Type", "text/html")
                .send(`<h1>Verification Link Expired</h1>`);
        }

        user.isVerifyToken = true;
        await user.save();

        return res
            .status(200)
            .setHeader("Content-Type", "text/html")
            .send(`<h1>Your account has been verified successfully!</h1>`);
    } catch (error) {
        return res
            .status(400)
            .setHeader("Content-Type", "text/html")
            .send(`<h1>Invalid or Expired Token</h1><p>Please request a new verification email.</p>`);
    }
});

export const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"all field required"})
    }
    const user = await User.findOne({where:{email:email}})
    const isPassCorrect = await bcrypt.compare(password,user.password);
    if(!isPassCorrect){
        return res.status(400).json({message:"invalid credential(password)"})
    }
    const checkedRemovedUser = await DeletedUser.findOne({where:{id:user.id,email:user.email}})

    if(checkedRemovedUser){
        return res.status(300).json({message:"you have already deleted this account please go to recovery page"})
    }
    const currentUser = user.toJSON();
    delete currentUser.password;
    const token = await generateToken({id:currentUser.id,email:currentUser.email})
    currentUser.token = token
    return res.status(200).cookie("token",token,{httpOnly:true,sameSite:'strict',}).json(currentUser)
    
})

export const currentUser = asyncHandler(async(req,res)=>{
    const user = req.user;
    const checkedRemovedUser = await DeletedUser.findOne({where:{email:user.email,userId:user.id}})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    if(checkedRemovedUser){
        return res.status(401).json(401).json({message:"you have already deleted this account please go to recovery page"})
    }
    const token = await generateToken({id:user.id,email:user.email})
    user.token = token;
    return res.status(200).cookie('token',token,{httpOnly:true,secure:true,sameSite:'strict'}).json(user)
})

export const updateProfile = asyncHandler(async(req,res)=>{
    const {bio,name,dob,mobileNumber} = req.body;
    console.log(bio,name,dob,mobileNumber)
    console.log(bio,name,dob,mobileNumber)
    const avatarFile = req.files?.avatar?.[0]?.path;
    const coverFile = req.files?.coverImage?.[0]?.path;
    const user = await User.findOne({where:{id:req.user.id,email:req.user.email}});
    
    if(!user){
        return res.status(401).json({message:"Unauthorized request"});
    }

    let avatarUpload = null;
    let coverUpload = null;

    if(avatarFile){
        avatarUpload = await ImageUpload(avatarFile);
        avatarUpload = await logoImageByPublicId(avatarUpload.publicId)

    }
    if(coverFile){
        coverUpload = await ImageUpload(coverFile);
        coverUpload = await coverImageByPublicId(coverUpload.publicId)
    }
    console.log(avatarUpload)
    console.log(coverUpload)

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.dob = dob ?? user.dob;
    user.mobileNumber = String(mobileNumber).length === 10 ? mobileNumber : user.mobileNumber;
    user.avatar = avatarUpload?.url ?? user.avatar;
    user.avatarId = avatarUpload?.publicId ?? user.avatarId;
    user.coverImage = coverUpload?.url ?? user.coverImage;
    user.coverImageId = coverUpload?.publicId ?? user.coverImageId;

    await user.save();
    return res.status(200).json(user);
});

export const logout = asyncHandler(async (req, res) => {
    
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', 
    });

    return res.status(200).json({ message: 'Logout successful' });
});



export const deleteCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { id: req.user.id, email: req.user.email } });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const alreadyDeleted = await DeletedUser.findOne({ where: { email: user.email } });

    if (alreadyDeleted) {
        return res.status(400).json({ message: "This account has already been deleted." });
    }

    let alreadyOtp = await OTP.findOne({ where: { email: user.email } });

    if (!alreadyOtp) {
        await OTP.create({ userId: user.id, email: user.email, otp, expireTime: Date.now() + 10 * 60 * 1000 });
        await SendOtp({ userEmail: user.email, otp, subject: "Account Deletion OTP from Code Member" });
        return res.status(200).json({ message: "Please verify the OTP sent to your email." });
    }

    if (alreadyOtp.expireTime < Date.now()) {

        alreadyOtp.otp = otp;
        alreadyOtp.expireTime = Date.now() + 10 * 60 * 1000; 
        await alreadyOtp.save({validate:false});
        await SendOtp({ userEmail: user.email, otp, subject: "Account Deletion OTP from Code Member" });
        return res.status(200).json({ message: "Please verify the OTP sent to your email." });
    }
    return res.status(200).json({ message: "OTP already sent to your email." });
});

export const deleteVerify = asyncHandler(async(req,res)=>{
    const {otp} = req.body;
    if(!otp ){
        return res.status(400).json({message:"not found otp"})
    }
    const user = await User.findOne({where:{id:req.user.id,email:req.user.email}})
    if(!user){
        return res.status(401).json({message:'Unauthorized request'})
    }
    const otpObject = await OTP.findOne({where:{
        email:user.email,userId:user.id
    }})
    if(!otpObject){
        return res.status(401).json({message:"please first send delete request"})
    }
    if(otpObject.expireTime<Date.now()){
        OTP.destroy({where:{email:user.email}})
        return res.status(401).json({message:"expire otp please generate again"})
    }
    if(otp!==otpObject.otp){
        return res.status(401).json({message:'otp not match, please try, again'})
    }
    const id = user.id;
     delete user.id
    
    await DeletedUser.create({
        userId:user.id,
        name:user.name,
        email:user.email,
        password:user.password,
        dob:user.dob,
        isVerifyToken:user.isVerifyToken,
        token:user.token,
        accessIp:user.accessIp,
        coverImage:user.coverImage,
        avatar:user.avatar,
        avatarId:user.avatarId,
        coverImageId:user.coverImageId,
        mobileNumber:user.mobileNumber,
        bio:user.bio,
    },{timestamps:true});
    await OTP.destroy({where:{email:otpObject.email}})
    return res.status(200).json({message:'account deleted successfully'})
})


export const recoveryUser = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email field is required' });
    }

    const existAccount = await DeletedUser.findOne({ where: { email } });

    if (!existAccount) {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({ message: 'Your account is already active. Please go to the login page.' });
        }
        return res.status(404).json({ message: 'No account found with this email.' });
    }

    const now = Date.now();
    const otp = Math.floor(100000 + Math.random() * 900000);

    let existingOtp = await OTP.findOne({ where: { email } });

    if (!existingOtp || existingOtp.expireTime <= now) {
        if (existingOtp) {
            await OTP.destroy({ where: { email } });
        }
        existingOtp = await OTP.create({
            userId: existAccount.userId,
            email,
            otp,
            expireTime: now + 10 * 60 * 1000, // 10 mins
        });
    }

    await SendOtp({
        userEmail: email,
        otp,
        message: 'Account recovery OTP',
    });

    const token = await generateToken({ id: existAccount.id, email: existAccount.email });

    return res
        .status(200)
        .cookie('token', token, { httpOnly: true, sameSite: 'strict' })
        .json({ message: 'Recovery OTP sent to your email.' });
});


export const recoveryVerify = asyncHandler(async(req,res)=>{
    const {otp} = req.body;
    const user = req.user;
    if(!otp){
        return res.status(400).json({message:"please otp required"})
    }
    const otpObject = await OTP.findOne({where:{userId:user.id,email:user.email}})
    if(otp!==otpObject.otp){
        return res.status(400).json({message:'Otp not match'})
    }
    await OTP.destroy({where:{email:user.email,userId:user.id}})
    await DeletedUser.destroy({where:{email:user.email,userId:user.id}})
    return res.status(200).json({message:"user account has been recovered go to login"})
})

export const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const existAccount = await User.findOne({ where: { email } });

    if (!existAccount) {
        return res.status(401).json({ message: "Invalid email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    let alreadyOtp = await OTP.findOne({ where: { email } });


    if (!alreadyOtp) {
        await OTP.create({ userId: existAccount.id, email, otp, expireTime: Date.now() + 10 * 60 * 1000 });
        await SendOtp({ userEmail: email, otp, message: "Reset password verification code" });
        return res.status(200).json({ message: "OTP sent to your email" });
    }
    console.log(alreadyOtp)
    if (alreadyOtp.expireTime <= Date.now()) {
        await OTP.destroy({where:{email}})
        alreadyOtp.otp = otp;
        alreadyOtp.expireTime = Date.now() + 10 * 60 * 1000;
        await alreadyOtp.save();
        await SendOtp({ userEmail: email, otp, message: "Reset password verification code" });
        return res.status(200).json({ message: "New OTP sent. Please verify." });
    }

    return res.status(200).json({ message: "OTP already sent to your email" });
});

export const resetPasswordVerify = asyncHandler(async(req,res)=>{
    const {password,otp,email} = req.body;
    
    if(!password || !otp || !email ){
        return res.status(400).json({message:"all field required"})
    }
    const existAccount = await User.findOne({where:{email}})
    if(!existAccount){
        return res.status(400).json({message:"Invalid email"})
    }
    const otpObject = await OTP.findOne({where:{email}})
    if(!otpObject){
        return res.status(401).json({message:"Please first generate otp"})
    }
    console.log("req otp", otp)
    console.log("database otp",otpObject.otp)
    if(otpObject.otp!==otp){
        return res.status(401).json({message:"Invalid otp"})
    }
    const hashPassword = await bcrypt.hash(password,10)
    const user = await User.findOne({where:{email}})
    user.password = hashPassword;
    await user.save({validate:false})
    await OTP.destroy({where:{email}})
    return res.status(200).cookie('token',"",{httpOnly:true,sameSite:'strict',secure:true}).json({message:"password reset successfully"})
})