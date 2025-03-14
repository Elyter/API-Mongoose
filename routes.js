const express = require('express');
const profileRoutes = require('./api/profiles');

const router = express.Router();

router.use('/profiles', profileRoutes);

module.exports = router;
