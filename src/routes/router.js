const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/user', authRoutes);
router.use('/userprofile', userRoutes)


module.exports = router;