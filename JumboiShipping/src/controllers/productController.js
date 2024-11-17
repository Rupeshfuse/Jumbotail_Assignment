const Product = require('../models/product');
const Seller = require('../models/seller');

exports.createProduct = async (req, res, next) => {
    try {
        const { productId, name, category, sellerId, sellingPrice, weight, dimensions, stockQuantity } = req.body;

        const seller = await Seller.findOne({ sellerId });
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const product = new Product({
            productId,
            name,
            category,
            seller: seller._id,
            sellingPrice,
            weight,
            dimensions,
            stockQuantity
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};