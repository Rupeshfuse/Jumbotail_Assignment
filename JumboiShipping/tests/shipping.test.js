const request = require('supertest');
const app = require('../src/app');
const Warehouse = require('../src/models/warehouse');
const Customer = require('../src/models/customer');
const Seller = require('../src/models/seller');
const Product = require('../src/models/product');

describe('Shipping API', () => {
    beforeEach(async () => {
        await Warehouse.deleteMany({});
        await Customer.deleteMany({});
        await Seller.deleteMany({});
        await Product.deleteMany({});
    });

    describe('GET /api/v1/shipping-charge', () => {
        it('should return 404 if warehouse or customer is not found', async () => {
            const response = await request(app)
                .get('/api/v1/shipping-charge')
                .query({
                    warehouseId: 'non_existent_warehouse',
                    customerId: 'non_existent_customer',
                    deliverySpeed: 'standard'
                });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'Warehouse or customer not found');
        });
    });

    describe('POST /api/v1/shipping-charge/calculate', () => {
        it('should calculate shipping charges with nearest warehouse', async () => {
            const seller = new Seller({
                sellerId: 'seller1',
                name: 'Test Seller',
                email: 'seller@test.com',
                phoneNumber: '1234567890',
                address: 'Test Address',
                location: { lat: 0, lng: 0 }
            });
            await seller.save();

            const customer = new Customer({
                customerId: 'cust1',
                name: 'Test Customer',
                email: 'customer@test.com',
                phoneNumber: '0987654321',
                address: 'Customer Address',
                location: { lat: 1, lng: 1 }
            });
            await customer.save();

            const product = new Product({
                productId: 'product1',
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

            const warehouse = new Warehouse({
                warehouseId: 'warehouse1',
                name: 'Test Warehouse',
                location: { lat: 0.5, lng: 0.5 },
                address: 'Warehouse Address',
                capacity: 1000,
                products: [product._id]
            });
            await warehouse.save();

            const response = await request(app)
                .post('/api/v1/shipping-charge/calculate')
                .send({
                    sellerId: 'seller1',
                    customerId: 'cust1',
                    deliverySpeed: 'standard',
                    items: [{ itemId: 'product1', quantity: 1 }]
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('shippingCharges');
            expect(response.body).toHaveProperty('nearestWarehouse');
            expect(response.body.nearestWarehouse).toHaveProperty('warehouseId', warehouse.warehouseId);
        });

        it('should return 400 if required parameters are missing', async () => {
            const response = await request(app)
                .post('/api/v1/shipping-charge/calculate')
                .send({ sellerId: 'seller1', customerId: 'cust1' });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'Missing or invalid required parameters');
        });

        it('should return 404 if no warehouse is found', async () => {
            const seller = new Seller({
                sellerId: 'seller1',
                name: 'Test Seller',
                email: 'seller@test.com',
                phoneNumber: '1234567890',
                address: 'Test Address',
                location: { lat: 0, lng: 0 }
            });
            await seller.save();

            const customer = new Customer({
                customerId: 'cust1',
                name: 'Test Customer',
                email: 'customer@test.com',
                phoneNumber: '0987654321',
                address: 'Customer Address',
                location: { lat: 1, lng: 1 }
            });
            await customer.save();

            const response = await request(app)
                .post('/api/v1/shipping-charge/calculate')
                .send({
                    sellerId: 'seller1',
                    customerId: 'cust1',
                    deliverySpeed: 'standard',
                    items: [{ itemId: 'product1', quantity: 1 }]
                });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'No warehouse found');
        });
    });
});