import JWT from 'jsonwebtoken'


const generateToken = async(payload)=>{
    try {
        
        const token = JWT.sign(payload,process.env.SECURE_KEY,{expiresIn:"7d"})
        return token;
    } catch (error) {
        console.log(error)
        return {message:error.message}
    }
}

export {generateToken}