const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    sellingPrice: { type: Number, required: true },
    weight: { type: Number, required: true },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    stockQuantity: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);