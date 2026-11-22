const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// View farmer payments
router.get('/:farmerNo', verifyToken, async (req, res) => {
    try {
        const requestedFarmer = req.params.farmerNo;
        const loggedInUser = req.user;

        // Check that the role is allowed
        if (!['farmer', 'clerk', 'manager'].includes(loggedInUser.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Farmers can only view their own payments
        if (
            loggedInUser.role === 'farmer' &&
            loggedInUser.FarmerNo !== requestedFarmer
        ) {
            return res.status(403).json({
                success: false,
                message: 'You can only view your own payments'
            });
        }

        // Retrieve the farmer's delivery and payment records
        const [results] = await db.query(
            'SELECT * FROM Deliveries WHERE FarmerNo = ?',
            [requestedFarmer]
        );

        res.status(200).json({
            success: true,
            message: 'Payment records retrieved successfully',
            data: results
        });

    } catch (error) {
        console.error('PAYMENTS ERROR:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payment records'
        });
    }
});

module.exports = router;