const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');

const app = express();

// Import routes
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/payments');
const deliveryRoutes = require('./routes/deliveries');
const certificateRoutes = require('./routes/certificateRoutes');

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5500'
}));

// Read JSON requests
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Payment routes
app.use('/api/payments', paymentRoutes);

// Delivery routes
app.use('/api/deliveries', deliveryRoutes);

// Report routes
app.use('/api/reports', reportRoutes);

// Serve farmer portal files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/certificates', certificateRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});

// Export application for automated testing
module.exports = app;

// Start server only when running app.js directly
if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log('MaziwaHub server running on port ' + (process.env.PORT || 3000));
    });
}