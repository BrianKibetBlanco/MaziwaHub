const express = require('express');
const router = express.Router();
const db = require('../config/db');

const {
    verifyToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

// POST: Record a delivery
router.post(
    '/',
    verifyToken,
    authorizeRoles('clerk', 'manager'),
    async (req, res) => {
        try {
            const { farmerNo, centreID, litres, rate } = req.body;

            // Validate input
            if (
                !farmerNo ||
                !centreID ||
                litres === undefined ||
                rate === undefined ||
                !Number.isFinite(Number(litres)) ||
                !Number.isFinite(Number(rate)) ||
                Number(litres) <= 0 ||
                Number(rate) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Farmer number, centre ID, valid litres and rate are required.'
                });
            }

            // Check whether farmer exists
            const [farmers] = await db.query(
                'SELECT FarmerNo FROM Farmers WHERE FarmerNo = ?',
                [farmerNo]
            );

            if (farmers.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Farmer does not exist.'
                });
            }

            // Check whether collection centre exists
            const [centres] = await db.query(
                'SELECT CentreID FROM Centres WHERE CentreID = ?',
                [centreID]
            );

            if (centres.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection centre does not exist.'
                });
            }

            const deliveryID = 'D' + Date.now().toString().slice(-9);
            const amount = Number(litres) * Number(rate);

            // Save delivery in MySQL
            await db.query(
                `INSERT INTO Deliveries
                (DeliveryID, DeliveryDate, FarmerNo, CentreID, Litres, Rate, Amount)
                VALUES (?, CURDATE(), ?, ?, ?, ?, ?)`,
                [
                    deliveryID,
                    farmerNo,
                    centreID,
                    Number(litres),
                    Number(rate),
                    amount
                ]
            );

            res.status(201).json({
                success: true,
                message: 'Delivery recorded successfully.',
                delivery: {
                    deliveryID,
                    farmerNo,
                    centreID,
                    litres: Number(litres),
                    rate: Number(rate),
                    amount
                }
            });

        } catch (error) {
            console.error('DELIVERY ERROR:', error);

            res.status(500).json({
                success: false,
                message: 'Failed to record delivery.'
            });
        }
    }
);

module.exports = router;