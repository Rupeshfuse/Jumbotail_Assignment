const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jumboi_shipping_test';

beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});