const express = require('express');
const { login, signup } = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(login);
router.route('/signup').post(signup);



module.exports = router;

// Define Routes: In authRoutes.js, you typically define various routes related to authentication (e.g., login, signup).
// Create Router: You create an instance of an Express router using const router = require('express').Router();.
// Attach Routes: You attach route handlers to the router instance (e.g., router.post('/login', loginHandler);).
// Export Router: Finally, you export the router instance using module.exports = router;.