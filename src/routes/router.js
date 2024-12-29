const express = require('express');
const getdata = require('./authRoutes.js');
const router = express.Router();


router.route('/getdata').get(getdata); 


router.get('/', (req, res) => {
    res.send('Hello, world!');
});

router.get('/test', (req, res) => {
    res.send('Hello, test!');
});

module.exports = router;