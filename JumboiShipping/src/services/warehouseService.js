const Warehouse = require('../models/warehouse');
const Seller = require('../models/seller');
const { calculateDistance } = require('../utils/distanceCalculator');

exports.getNearestWarehouse = async (sellerId, productId) => {
    const seller = await Seller.findOne({ sellerId });
    if (!seller) {
        throw new Error('Seller not found');
    }

    const warehouses = await Warehouse.find();
    if (warehouses.length === 0) {
        throw new Error('No warehouses found');
    }

    let nearestWarehouse = null;
    let shortestDistance = Infinity;

    for (const warehouse of warehouses) {
        const distance = calculateDistance(
            seller.location.lat,
            seller.location.lng,
            warehouse.location.lat,
            warehouse.location.lng
        );

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestWarehouse = warehouse;
        }
    }

    return nearestWarehouse;
};  