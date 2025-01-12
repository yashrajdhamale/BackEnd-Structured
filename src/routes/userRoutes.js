const express = require('express');
const { getprofile } = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateJWT, getprofile);

module.exports = router;