require('dotenv').config({
    path: require('path').join(__dirname, '../.env')
});

process.env.JWT_SECRET =
    process.env.JWT_SECRET || 'test_secret_for_maziwahub';

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock the database
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

const db = require('../config/db');
const app = require('../app');

// Generate a clerk authentication token
const token = jwt.sign(
    {
        id: 1,
        role: 'clerk'
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

describe('POST /api/deliveries', () => {

    beforeEach(() => {
        db.query.mockReset();
    });

    // TEST 1: Correct delivery
    test('should successfully record a delivery', async () => {

        db.query
            .mockResolvedValueOnce([[{ FarmerNo: 'F012' }]])
            .mockResolvedValueOnce([[{ CentreID: 1 }]])
            .mockResolvedValueOnce([{}]);

        const response = await request(app)
            .post('/api/deliveries')
            .set('Authorization', `Bearer ${token}`)
            .send({
                farmerNo: 'F012',
                centreID: 1,
                litres: 25,
                rate: 52
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.delivery.amount).toBe(1300);
    });

    // TEST 2: Missing litres
    test('should reject a delivery with missing litres', async () => {

        const response = await request(app)
            .post('/api/deliveries')
            .set('Authorization', `Bearer ${token}`)
            .send({
                farmerNo: 'F012',
                centreID: 1,
                rate: 52
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    // TEST 3: Request without token
    test('should reject a request without an authentication token', async () => {

        const response = await request(app)
            .post('/api/deliveries')
            .send({
                farmerNo: 'F012',
                centreID: 1,
                litres: 25,
                rate: 52
            });

        expect(response.status).toBe(401);
    });

    // TEST 4: Farmer does not exist
    test('should reject a delivery for a non-existent farmer', async () => {

        db.query.mockResolvedValueOnce([[]]);

        const response = await request(app)
            .post('/api/deliveries')
            .set('Authorization', `Bearer ${token}`)
            .send({
                farmerNo: 'F999',
                centreID: 1,
                litres: 25,
                rate: 52
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

});