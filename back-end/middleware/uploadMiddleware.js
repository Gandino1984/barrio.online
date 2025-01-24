import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { validateImageMiddleware, SUPPORTED_IMAGE_TYPES } from '../utils/imageValidationUtilities.js';
import { processUploadedImage } from '../../front-end/utils/imageConversionUtils.js';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const profileImageStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', 'users');
        
        try {
            await fs.promises.mkdir(uploadsDir, { recursive: true });
            await fs.promises.chmod(uploadsDir, 0o755);
            
            if (req.body.name_user) {
                const userDir = path.join(uploadsDir, req.body.name_user);
                await fs.promises.mkdir(userDir, { recursive: true });
                await fs.promises.chmod(userDir, 0o755);
                cb(null, userDir);
            } else {
                cb(new Error('Usuario no especificado'));
            }
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        // Use original name but always with .webp extension
        const fileName = 'profile.webp';
        cb(null, fileName);
    }
});

const productImageStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const { shop_name, product_id } = req.body;

        if (!shop_name || !product_id) {
            return cb(new Error('Shop name and product ID are required'));
        }

        const uploadsDir = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', 'shops', shop_name, 'product_images');

        try {
            await fs.promises.mkdir(uploadsDir, { recursive: true });
            await fs.promises.chmod(uploadsDir, 0o755);
            cb(null, uploadsDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const { product_id } = req.body;
        const fileName = `${product_id}.webp`;
        cb(null, fileName);
    }
});

const uploadProfileImage = multer({
    storage: profileImageStorage,
    fileFilter: (req, file, cb) => {
        if (!Object.keys(SUPPORTED_IMAGE_TYPES).includes(file.mimetype)) {
            return cb(new Error('Tipo de archivo no soportado'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});


const uploadProductImage = multer({
    storage: productImageStorage, // Use the defined storage configuration
    fileFilter: (req, file, cb) => {
        const shop_name = req.body.shop_name;
        const product_id = req.body.product_id;

        if (!shop_name || !product_id) {
            return cb(new Error('Shop name and Product ID are absolutely required'), false);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.'), false);
        }
    }
});


// Middleware for handling user profile image uploads
const handleProfileImageUpload = async (req, res, next) => {
    console.log('-> uploadMiddleware - handleProfileImageUpload() - Iniciando upload middleware');

    uploadProfileImage.single('profileImage')(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                error: 'Error al subir el archivo',
                details: err.message
            });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                error: 'Error al subir el archivo de imagen',
                details: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: 'No se ha proporcionado ningún archivo'
                });
            }

            // Process and convert the image to WebP
            req.file = await processUploadedImage(req.file);

            // Continue to validation middleware
            validateImageMiddleware(req, res, next);
        } catch (error) {
            console.error('Error processing image:', error);
            return res.status(500).json({
                error: 'Error al procesar la imagen',
                details: error.message
            });
        }
    });
};

const handleProductImageUpload = async (req, res, next) => {
    console.log('-> uploadMiddleware - handleProductImageUpload() - Starting upload middleware');

    // Use Multer to handle the file upload
    uploadProductImage.single('productImage')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                error: 'Error uploading file',
                details: err.message
            });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                error: 'Error uploading product image',
                details: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: 'No file provided'
                });
            }

            // Log the parsed fields for debugging
            console.log('Parsed Fields:', {
                product_id: req.body.product_id,
                shop_name: req.body.shop_name
            });

            // Ensure required fields are present
            if (!req.body.product_id || !req.body.shop_name) {
                return res.status(400).json({
                    error: 'Shop name and Product ID are required'
                });
            }

            // Process and convert the image to WebP
            req.file = await processUploadedImage(req.file);

            // Continue to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Error processing image:', error);
            return res.status(500).json({
                error: 'Error processing product image',
                details: error.message
            });
        }
    });
};

export { handleProfileImageUpload, handleProductImageUpload };