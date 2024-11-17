const Customer = require('../models/customer');

exports.createCustomer = async (req, res, next) => {
    try {
        const { customerId, name, phoneNumber, location, address, email } = req.body;
        const customer = new Customer({
            customerId,
            name,
            phoneNumber,
            location,
            address,
            email
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
};