// server/routes/filterRoutes.js
const express = require('express');
const router = express.Router();
const { filterOutfits } = require('../controllers/filterController');

router.post('/filter', filterOutfits);

module.exports = router;
