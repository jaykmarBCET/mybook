import multer from 'multer';
import fs from 'fs';

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerMiddleware = multer({ dest: uploadDir });

export { multerMiddleware };
