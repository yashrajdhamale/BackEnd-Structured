const express = require('express');
const router = require('./routes/router'); // Import your routes
const connectDB = require('./config/connectDB'); // Import your DB connection function

const app = express();

// Middleware setup
app.use(express.json()); // Allows parsing of JSON request bodies

// Use your routes
app.use('/', router);

module.exports = app;
