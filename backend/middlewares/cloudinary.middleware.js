import dotenv from 'dotenv';
dotenv.config();

// config/cloudinary.js
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a storage object with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'user_profiles', // The folder in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png'], // Specify allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional transformations
  },
});

// Create a multer instance with the storage engine
const upload = multer({ storage });

export { upload };
