const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const shippingController = require('../controllers/shippingController');
const sellerController = require('../controllers/sellerController');
const productController = require('../controllers/productController');
const customerController = require('../controllers/customerController');



router.post('/warehouse', warehouseController.createWarehouse);
router.get('/warehouse/all', warehouseController.getAllWarehouses);
router.get('/warehouse/nearest', warehouseController.getNearestWarehouse);

router.get('/shipping-charge', shippingController.getShippingCharge);
router.post('/shipping-charge/calculate', shippingController.calculateShippingCharges);
router.post('/seller', sellerController.createSeller);
router.post('/product', productController.createProduct);
router.post('/customer', customerController.createCustomer);



module.exports = router;