const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    sellerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Seller', sellerSchema);