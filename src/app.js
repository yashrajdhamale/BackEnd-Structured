const express = require('express');
const router = require('./routes/router'); 

const connectDB = require('./config/connectDB'); 
const CORS = require('cors'); 
const app = express();

// Middleware setup
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(CORS()); // Allows Cross-Origin Resource Sharing

// Use your routes
app.use('/', router);

module.exports = app;
