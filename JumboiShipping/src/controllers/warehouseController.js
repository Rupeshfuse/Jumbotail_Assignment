const Warehouse = require('../models/warehouse');
const calculateDistance = require('../utils/distanceCalculator');
const Seller = require('../models/seller');
const Product = require('../models/product');

exports.createWarehouse = async (req, res, next) => {
    try {
        const { name, location, address, capacity } = req.body;
        const warehouseId = `warehouse_${Date.now()}`;
        const warehouse = new Warehouse({
            warehouseId,
            name,
            location,
            address,
            capacity
        });
        await warehouse.save();
        res.status(201).json(warehouse);
    } catch (error) {
        next(error);
    }
};

exports.getNearestWarehouse = async (req, res, next) => {
    try {
        const { sellerId, productId } = req.query;
        if (!sellerId || !productId) {
            return res.status(400).json({ error: 'Missing sellerId or productId' });
        }

        const seller = await Seller.findOne({ sellerId });
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const warehouses = await Warehouse.find();
        if (warehouses.length === 0) {
            return res.status(404).json({ error: 'No warehouse found' });
        }

        const nearestWarehouse = warehouses.reduce((nearest, warehouse) => {
            const distance = calculateDistance(
                seller.location,
                warehouse.location
            );
            return distance < nearest.distance ? { warehouse, distance } : nearest;
        }, { warehouse: null, distance: Infinity });

        if (!nearestWarehouse.warehouse) {
            return res.status(404).json({ error: 'No suitable warehouse found' });
        }

        res.status(200).json({
            warehouseId: nearestWarehouse.warehouse.warehouseId,
            name: nearestWarehouse.warehouse.name,
            distance: nearestWarehouse.distance
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllWarehouses = async (req, res, next) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        next(error);
    }
};