const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER USER
exports.register = async (req, res) => {
    try {
        const { name, phone, password, role, FarmerNo } = req.body;

        if (!name || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, phone, password and role"
            });
        }

        const allowedRoles = ['farmer', 'clerk', 'manager'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (role === 'farmer' && !FarmerNo) {
            return res.status(400).json({
                success: false,
                message: "FarmerNo is required for farmer accounts"
            });
        }

        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE phone = ?',
            [phone]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Phone number already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (name, phone, password, FarmerNo, role)
             VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                phone,
                hashedPassword,
                role === 'farmer' ? FarmerNo : null,
                role
            ]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};


// LOGIN USER
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone and password are required"
            });
        }

        const [rows] = await db.query(
            'SELECT id, name, phone, password, FarmerNo, role FROM users WHERE phone = ?',
            [phone]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Wrong phone or password"
            });
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Wrong phone or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                FarmerNo: user.FarmerNo
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                FarmerNo: user.FarmerNo,
                role: user.role
            }
        });

    } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message
    });
}
};