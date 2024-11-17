const Seller = require('../models/seller');

exports.createSeller = async (req, res, next) => {
    try {
        const { sellerId, name, email, phoneNumber, address, location } = req.body;
        const seller = new Seller({
            sellerId,
            name,
            email,
            phoneNumber,
            address,
            location
        });
        await seller.save();
        res.status(201).json(seller);
    } catch (error) {
        next(error);
    }
};