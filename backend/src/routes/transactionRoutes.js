const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Initialize Database
router.get('/initialize-database', transactionController.initializeDatabase);

// List Transactions
router.get('/', transactionController.listTransactions);

router.get('/statistics' , transactionController.getStatistics);

router.get('/get-bar-chart-data' , transactionController.getBarChartData);

router.get('/get-pie-chart-data' , transactionController.getPieChartData);

router.get("/get-combined-data" , transactionController.getCombinedData);

module.exports = router;