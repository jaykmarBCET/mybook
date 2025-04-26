import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});


const ImageUpload = async (imagePath) => {
    try {
        const response = await cloudinary.uploader.upload(imagePath, {
            resource_type: 'image'
        });
        return { url: response.secure_url, publicId: response.public_id };
    } catch (error) {
        console.log(error);
        return { message: error.message };
    }
};


const VideoUpload = async (videoPath) => {
    try {
        const response = await cloudinary.uploader.upload(videoPath, {
            resource_type: 'video'
        });
        return { url: response.secure_url, publicId: response.public_id };
    } catch (error) {
        console.log(error);
        return { message: error.message };
    }
};


const streamData = async (stream) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.pipe(uploadStream);
    });
};


const deleteData = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
};


const logoImageByPublicId = (publicId) => {
    return cloudinary.url(publicId, {
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { radius: "max" },
        { effect: "sharpen" }
      ],
      secure: true
    });
  };
  
  const coverImageByPublicId = (publicId) => {
    if (!publicId) return null;
  
    return cloudinary.url(publicId, {
      transformation: [
        { width: 820, height: 312, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
        { fetch_format: "auto" }
      ],
      secure: true
    });
  };
  

// ✅ Raw image tag generator (optional, mostly for frontend HTML rendering)
const logoImage = async(imagePath) => {
    return cloudinary.image(imagePath, {
        transformation: [
            { width: 200, height: 200, crop: "fill", gravity: "face" },
            { radius: "max" },
            { effect: "sharpen" }
        ],
        secure: true
    });
};

// ✅ Cover image tag generator (optional)
const coverImage = (imagePath) => {
    return cloudinary.image(imagePath, {
        transformation: [
            { width: 820, height: 312, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' },
            { fetch_format: "auto" }
        ],
        secure: true
    });
};

// ✅ Smart upload (auto-detect type)
const dataUpload = async (path) => {
    const response = await cloudinary.uploader.upload(path, {
        resource_type: "auto",
        transformation: [{ quality: "auto" }]
    });
    return { publicId: response.public_id, url: response.secure_url };
};

const uploadStreamData = async (bufferData) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' }, // or auto/video based on use case
        (error, result) => {
          if (error) return reject(error);
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
          });
        }
      );
  
      uploadStream.end(bufferData);
    });
  };

export {
    ImageUpload,
    VideoUpload,
    streamData,
    deleteData,
    logoImageByPublicId,
    coverImageByPublicId,
    logoImage,
    coverImage,
    dataUpload,
    uploadStreamData
};