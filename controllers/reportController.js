const db = require('../config/db');

// Report 1: Total litres and amount per farmer
exports.getFarmerTotals = async (req, res) => {
    try {
        const sql = `
            SELECT
                f.FarmerNo,
                f.FarmerName,
                SUM(d.Litres) AS Total_Litres,
                SUM(d.Amount) AS Total_Amount
            FROM Farmers f
            JOIN Deliveries d
                ON f.FarmerNo = d.FarmerNo
            WHERE d.DeliveryDate >= '2026-10-01'
              AND d.DeliveryDate < '2026-11-01'
            GROUP BY f.FarmerNo, f.FarmerName
        `;

        const [results] = await db.query(sql);

        res.status(200).json({
            success: true,
            message: "Farmer totals retrieved successfully",
            data: results
        });

    } catch (error) {
        console.error("MYSQL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve farmer totals",
            error: error.message
        });
    }
};


// Report 2: Total deliveries per collection centre
exports.getCentreTotals = async (req, res) => {
    try {
        const sql = `
            SELECT
                c.CentreName,
                COUNT(d.DeliveryID) AS Total_Deliveries
            FROM Centres c
            LEFT JOIN Deliveries d
                ON c.CentreID = d.CentreID
            GROUP BY c.CentreID, c.CentreName
        `;

        const [results] = await db.query(sql);

        res.status(200).json({
            success: true,
            message: "Collection centre totals retrieved successfully",
            data: results
        });

    } catch (error) {
        console.error("MYSQL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve collection centre totals",
            error: error.message
        });
    }
};