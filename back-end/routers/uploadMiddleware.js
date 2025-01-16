// uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create initial storage configuration
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
        try {
            await fs.promises.mkdir(tempDir, { recursive: true });
            cb(null, tempDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up multer with temporary storage
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png)'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

// Middleware to handle the upload and move file to correct location
const uploadProfileImage = async (req, res, next) => {
    console.log('Starting upload middleware');
    
    upload.single('profileImage')(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                error: 'Error al subir el archivo: ' + err.message
            });
        } else if (err) {
            console.error('Non-multer error:', err);
            return res.status(400).json({
                error: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: 'No se ha subido ningún archivo'
                });
            }
    
            const userDir = path.join(__dirname, '..', 'uploads', 'users', req.body.name_user);
            await fs.promises.mkdir(userDir, { recursive: true });
    
            const newPath = path.join(userDir, req.file.filename);
            await fs.promises.rename(req.file.path, newPath);
    
            // Update the path to be relative to the uploads directory
            req.file.path = path.relative(path.join(__dirname, '..', 'uploads'), newPath);
            req.file.destination = path.relative(path.join(__dirname, '..', 'uploads'), userDir);
    
            next();
        } catch (error) {
            console.error('Error in upload middleware:', error);
            // Clean up temp file if it exists
            if (req.file && req.file.path) {
                try {
                    await fs.promises.unlink(req.file.path);
                } catch (cleanupError) {
                    console.error('Error cleaning up temp file:', cleanupError);
                }
            }
            return res.status(500).json({
                error: 'Error al procesar la carga',
                details: error.message
            });
        }
    });
};

export { uploadProfileImage };