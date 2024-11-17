const calculateDistance = require('../utils/distanceCalculator');

const DELIVERY_SPEEDS = {
    standard: { multiplier: 1, days: 5 },
    express: { multiplier: 1.5, days: 3 },
    overnight: { multiplier: 2, days: 1 }
};

exports.calculateDistance = calculateDistance;

exports.calculateShippingCharge = async (warehouse, customer, deliverySpeed) => {
    if (!DELIVERY_SPEEDS[deliverySpeed]) {
        throw new Error('Invalid delivery speed');
    }

    const distance = calculateDistance(warehouse.location, customer.location);
    const baseCharge = distance * 0.1; // $0.1 per km
    const speedMultiplier = DELIVERY_SPEEDS[deliverySpeed].multiplier;

    return baseCharge * speedMultiplier;
};

exports.calculateShippingCharges = async (warehouse, customer, deliverySpeed, items) => {
    if (!DELIVERY_SPEEDS[deliverySpeed]) {
        throw new Error('Invalid delivery speed');
    }

    const distance = calculateDistance(warehouse.location, customer.location);
    const baseCharge = distance * 0.1; // $0.1 per km
    const speedMultiplier = DELIVERY_SPEEDS[deliverySpeed].multiplier;

    const itemCharges = items.map(item => {
        const itemCharge = baseCharge * speedMultiplier * item.quantity;
        return {
            itemId: item.itemId,
            quantity: item.quantity,
            charge: itemCharge
        };
    });

    const totalCharge = itemCharges.reduce((sum, item) => sum + item.charge, 0);

    return {
        items: itemCharges,
        totalCharge,
        estimatedDeliveryDays: DELIVERY_SPEEDS[deliverySpeed].days
    };
};