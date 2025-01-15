import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!req.body.name_user) {
            return cb(new Error('Username is required'));
        }
        
        const uploadDir = path.join(process.cwd(), 'uploads', 'users', req.body.name_user);
        console.log('Creating upload directory:', uploadDir); // Debug log
        
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('Directory created successfully'); // Debug log
            cb(null, uploadDir);
        } catch (error) {
            console.error('Error creating directory:', error); // Debug log
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `profile-${uniqueSuffix}${ext}`;
        console.log('Generated filename:', filename); // Debug log
        cb(null, filename);
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
    console.log('Upload request received:', {
        body: req.body,
        files: req.files,
        file: req.file,
        headers: req.headers
    });

    if (!req.body.name_user) {
        console.log('Name user not found in request body:', req.body);
        return res.status(400).json({
            error: 'Username is required'
        });
    }

    upload.single('profileImage')(req, res, function(err) {
        console.log('Multer callback:', {
            error: err,
            file: req.file,
            body: req.body
        });

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
        
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({
                error: 'No se ha subido ningún archivo'
            });
        }

        // Log successful file upload
        console.log('File successfully processed:', {
            file: req.file,
            body: req.body,
            relativePath: path.join('users', req.body.name_user, path.basename(req.file.path))
        });
        
        // Add the relative path to the request
        req.file.relativePath = path.join('users', req.body.name_user, path.basename(req.file.path));
        
        next();
    });
};

export { uploadProfileImage };