// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/utils/db');
const transactionRoutes = require('./src/routes/transactionRoutes');
const { initializeDatabase } = require('./src/services/transactionService');
dotenv.config();

const app = express();

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,access-token,session_token,user-type,user_type,institute-id,institute_id');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

initializeDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));