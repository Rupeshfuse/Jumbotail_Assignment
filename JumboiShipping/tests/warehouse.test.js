const request = require('supertest');
const app = require('../src/app');
const Warehouse = require('../src/models/warehouse');
const Seller = require('../src/models/seller');
const Product = require('../src/models/product');

describe('Warehouse API', () => {
    beforeEach(async () => {
        await Warehouse.deleteMany({});
        await Seller.deleteMany({});
        await Product.deleteMany({});
    });

    describe('POST /api/v1/warehouse', () => {
        it('should create a new warehouse', async () => {
            const warehouseData = {
                name: 'Test Warehouse',
                location: { lat: 0, lng: 0 },
                address: 'Test Address',
                capacity: 1000
            };

            const response = await request(app)
                .post('/api/v1/warehouse')
                .send(warehouseData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('warehouseId');
            expect(response.body.name).toBe(warehouseData.name);
        });
    });

    describe('GET /api/v1/warehouse/nearest', () => {
        it('should return the nearest warehouse', async () => {
            const seller = new Seller({
                sellerId: 'seller123',
                name: 'Test Seller',
                email: 'seller@test.com',
                phoneNumber: '1234567890',
                address: 'Test Address',
                location: { lat: 0, lng: 0 }
            });
            await seller.save();

            const product = new Product({
                productId: 'product123',
                name: 'Test Product',
                category: 'Test Category',
                seller: seller._id,
                sellingPrice: 100,
                weight: 1,
                dimensions: {
                    length: 10,
                    width: 10,
                    height: 10
                },
                stockQuantity: 100
            });
            await product.save();

            const warehouse1 = new Warehouse({
                warehouseId: 'warehouse1',
                name: 'Warehouse 1',
                location: { lat: 1, lng: 1 },
                address: 'Address 1',
                capacity: 1000,
                products: [product._id]
            });
            await warehouse1.save();

            const warehouse2 = new Warehouse({
                warehouseId: 'warehouse2',
                name: 'Warehouse 2',
                location: { lat: 2, lng: 2 },
                address: 'Address 2',
                capacity: 1000,
                products: [product._id]
            });
            await warehouse2.save();

            const response = await request(app)
                .get('/api/v1/warehouse/nearest')
                .query({ sellerId: 'seller123', productId: 'product123' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('warehouseId', warehouse1.warehouseId);
        });

        it('should return 400 if sellerId or productId is missing', async () => {
            const response = await request(app)
                .get('/api/v1/warehouse/nearest')
                .query({ sellerId: 'seller123' });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'Missing sellerId or productId');
        });

        it('should return 404 if no warehouse is found', async () => {
            const seller = new Seller({
                sellerId: 'seller123',
                name: 'Test Seller',
                email: 'seller@test.com',
                phoneNumber: '1234567890',
                address: 'Test Address',
                location: { lat: 0, lng: 0 }
            });
            await seller.save();

            const product = new Product({
                productId: 'product123',
                name: 'Test Product',
                category: 'Test Category',
                seller: seller._id,
                sellingPrice: 100,
                weight: 1,
                dimensions: {
                    length: 10,
                    width: 10,
                    height: 10
                },
                stockQuantity: 100
            });
            await product.save();

            const response = await request(app)
                .get('/api/v1/warehouse/nearest')
                .query({ sellerId: 'seller123', productId: 'product123' });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'No warehouse found');
        });
    });

    describe('GET /api/v1/warehouse/all', () => {
        it('should return all warehouses', async () => {
            const warehouse1 = new Warehouse({
                warehouseId: 'warehouse1',
                name: 'Warehouse 1',
                location: { lat: 1, lng: 1 },
                address: 'Address 1',
                capacity: 1000
            });
            await warehouse1.save();

            const warehouse2 = new Warehouse({
                warehouseId: 'warehouse2',
                name: 'Warehouse 2',
                location: { lat: 2, lng: 2 },
                address: 'Address 2',
                capacity: 1000
            });
            await warehouse2.save();

            const response = await request(app).get('/api/v1/warehouse/all');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('warehouseId', 'warehouse1');
            expect(response.body[1]).toHaveProperty('warehouseId', 'warehouse2');
        });
    });
});