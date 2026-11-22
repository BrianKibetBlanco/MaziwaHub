const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Upload monthly milk quality certificate
router.post(
    '/upload',
    verifyToken,
    authorizeRoles('clerk', 'manager'),
    (req, res) => {

        upload.single('certificate')(req, res, (error) => {

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a certificate.'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Certificate uploaded successfully.',
                file: {
                    originalName: req.file.originalname,
                    savedName: req.file.filename,
                    size: req.file.size
                }
            });
        });
    }
);

module.exports = router;