import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!req.body.name_user) {
            return cb(new Error('Username is required'));
        }

        // Sanitize username for filesystem - keep spaces as is
        const uploadDir = path.join(process.cwd(), 'uploads', 'users', req.body.name_user);
        
        // Log the directory being created
        console.log('Creating upload directory:', uploadDir);
        
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `profile-${uniqueSuffix}${ext}`);
    }
});

// Create multer instance
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

// Middleware for handling profile image uploads
const uploadProfileImage = (req, res, next) => {
    upload.single('profileImage')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: 'Error al subir el archivo: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                error: 'No se ha subido ningún archivo'
            });
        }
        
        if (!req.body.name_user) {
            return res.status(400).json({
                error: 'Se requiere el nombre de usuario'
            });
        }
        
        // Add the relative path to the request
        req.file.relativePath = path.join('users', req.body.name_user, path.basename(req.file.path));
        
        next();
    });
};

export { uploadProfileImage };