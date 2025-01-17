import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        // Path to public uploads directory
        const uploadsDir = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', 'users');
        
        try {
            // Create the uploads directory if it doesn't exist
            await fs.promises.mkdir(uploadsDir, { recursive: true });
            
            // Ensure proper permissions for the uploads directory
            await fs.promises.chmod(uploadsDir, 0o755);
            
            if (req.body.name_user) {
                const userDir = path.join(uploadsDir, req.body.name_user);
                // Create the user-specific directory if it doesn't exist
                await fs.promises.mkdir(userDir, { recursive: true });
                // Set proper permissions for the user directory
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
        // Use 'profile' as filename with timestamp to ensure uniqueness
        const ext = path.extname(file.originalname);
        cb(null, 'profile' + ext);
    }
});
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
            if (!req.file || !req.body.name_user) {
                return res.status(400).json({
                    error: 'Faltan campos requeridos'
                });
            }

            // Set the public URL path for the image
            const relativePath = path.join('images', 'uploads', 'users', req.body.name_user, path.basename(req.file.path))
            .split(path.sep)
            .join('/');
            req.file.path = relativePath;

            next();
        } catch (error) {
            console.error('Error in upload middleware:', error);
            if (req.file) {
                try {
                    await fs.promises.unlink(req.file.path);
                } catch (cleanupError) {
                    console.error('Error cleaning up file:', cleanupError);
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