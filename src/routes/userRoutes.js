const express = require('express');
const { getprofile, updateLocation, getprofilesss } = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');
const getlocation = require('../middlewares/getlocation');

const router = express.Router();

router.get('/profile', authenticateJWT, getprofile);
router.post('/update-location', authenticateJWT, updateLocation);
router.get('/get-profiles', authenticateJWT, getprofilesss);

module.exports = router;