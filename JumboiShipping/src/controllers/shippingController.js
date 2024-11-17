const shippingService = require('../services/shippingService');
const Warehouse = require('../models/warehouse');
const Customer = require('../models/customer');
const Seller = require('../models/seller');
const Product = require('../models/product');

exports.getShippingCharge = async (req, res, next) => {
    try {
        const { warehouseId, customerId, deliverySpeed } = req.query;
        if (!warehouseId || !customerId || !deliverySpeed) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const warehouse = await Warehouse.findOne({ warehouseId });
        const customer = await Customer.findOne({ customerId });

        if (!warehouse || !customer) {
            return res.status(404).json({ error: 'Warehouse or customer not found' });
        }

        const shippingCharge = await shippingService.calculateShippingCharge(warehouse, customer, deliverySpeed);
        res.json({ shippingCharge });
    } catch (error) {
        console.error('Error in getShippingCharge:', error);
        if (error.message === 'Invalid delivery speed') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

exports.calculateShippingCharges = async (req, res, next) => {
    try {
        const { sellerId, customerId, deliverySpeed, items } = req.body;
        if (!sellerId || !customerId || !deliverySpeed || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Missing or invalid required parameters' });
        }

        const seller = await Seller.findOne({ sellerId });
        const customer = await Customer.findOne({ customerId });

        if (!seller || !customer) {
            return res.status(404).json({ error: 'Seller or customer not found' });
        }

        const warehouses = await Warehouse.find();
        if (warehouses.length === 0) {
            return res.status(404).json({ error: 'No warehouse found' });
        }

        const nearestWarehouse = warehouses.reduce((nearest, warehouse) => {
            const distance = shippingService.calculateDistance(seller.location, warehouse.location);
            return distance < nearest.distance ? { warehouse, distance } : nearest;
        }, { warehouse: null, distance: Infinity });

        if (!nearestWarehouse.warehouse) {
            return res.status(404).json({ error: 'No suitable warehouse found' });
        }

        const shippingCharges = await shippingService.calculateShippingCharges(nearestWarehouse.warehouse, customer, deliverySpeed, items);

        res.status(200).json({
            shippingCharges,
            nearestWarehouse: {
                warehouseId: nearestWarehouse.warehouse.warehouseId,
                name: nearestWarehouse.warehouse.name,
                distance: nearestWarehouse.distance
            }
        });
    } catch (error) {
        console.error('Error in calculateShippingCharges:', error);
        if (error.message === 'Invalid delivery speed') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};