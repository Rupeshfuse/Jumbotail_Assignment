const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    warehouseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Warehouse', warehouseSchema);