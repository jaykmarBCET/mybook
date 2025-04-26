import multer from 'multer'

const multerMiddleware = multer({dest:'/uploads'})

export {multerMiddleware}