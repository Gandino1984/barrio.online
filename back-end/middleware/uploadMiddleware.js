import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { processUploadedImage } from '../../front-end/utils/imageConversionUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a storage configuration for Multer
const createStorage = (destinationFolder) => {
    return multer.diskStorage({
        destination: async function (req, file, cb) {
            const uploadsDir = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', destinationFolder);
            
            try {
                await fs.promises.mkdir(uploadsDir, { recursive: true });
                await fs.promises.chmod(uploadsDir, 0o755);
                cb(null, uploadsDir);
            } catch (error) {
                cb(error);
            }
        },
        filename: function (req, file, cb) {
            // Use original name but always with .webp extension
            const fileName = `${Date.now()}-${file.originalname}.webp`; // Unique filename with timestamp
            cb(null, fileName);
        }
    });
};

// Multer configuration for user profile images
const userStorage = createStorage('users');
const uploadProfileImage = multer({
    storage: userStorage,
    fileFilter: (req, file, cb) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (validTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed.'), false);
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
}).single('profileImage'); // 'profileImage' is the field name for user images

// Multer configuration for product images
const productStorage = createStorage('products');
const uploadProductImage = multer({
    storage: productStorage,
    fileFilter: (req, file, cb) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (validTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed.'), false);
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
}).single('productImage'); // 'productImage' is the field name for product images

// Middleware for processing uploaded images
const processImageMiddleware = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded'
            });
        }

        // Process and convert the image to WebP
        req.file = await processUploadedImage(req.file);

        // Continue to the next middleware or controller
        next();
    } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({
            error: 'Error processing image',
            details: error.message
        });
    }
};

export { uploadProfileImage, uploadProductImage, processImageMiddleware };