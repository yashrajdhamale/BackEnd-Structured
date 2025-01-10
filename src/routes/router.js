const express = require('express');
const { login, signup } = require('./authRoutes');

const connectDB = require('../config/connectDB'); 
const router = express.Router();


router.route('/login').post(login); 
router.route('/signup').post(signup);

// router.get('/', (req, res) => {
//     res.send('Hello, world!');
// });

// router.get('/test', (req, res) => {
//     res.send('Hello, test!');
// });

module.exports = router;