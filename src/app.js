const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const router = require('./routes/router'); 

// Create Express App
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,              
}));



app.use('/', router);

module.exports = app;
