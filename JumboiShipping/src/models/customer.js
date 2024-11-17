const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = mongoose.model('Customer', customerSchema);