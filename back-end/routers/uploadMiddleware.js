import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get username from the form field
        const username = req.body.name_user;
        
        // Create user-specific directory path
        const uploadDir = path.join(process.cwd(), 'uploads', 'users', username);
        
        // Create directory if it doesn't exist
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (err) {
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'profile' + uniqueSuffix + ext);
    }
});

// Create upload middleware
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate file type
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
                error: 'Error al subir el archivo',
                details: err.message
            });
        } else if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        
        // Check for username after file is uploaded
        if (!req.body.name_user) {
            return res.status(400).json({
                error: 'Username is required'
            });
        }
        
        next();
    });
};

export { uploadProfileImage };