const express = require('express');
const router = express.Router();
const transactionRoutes = require('./transactionRoutes');

router.use('/transactions', transactionRoutes);

module.exports = router;