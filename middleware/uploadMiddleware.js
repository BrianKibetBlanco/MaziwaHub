const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Create uploads folder if it does not exist
const uploadFolder = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure where and how files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            crypto.randomBytes(16).toString('hex') +
            path.extname(file.originalname).toLowerCase();

        cb(null, uniqueName);
    }
});

// Allow only PDF, JPG and PNG
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png'
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

    if (
        allowedTypes.includes(file.mimetype) &&
        allowedExtensions.includes(extension)
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, JPG and PNG files are allowed.'));
    }
};

// Configure Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

module.exports = upload;