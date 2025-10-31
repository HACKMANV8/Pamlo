const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadClothes } = require('../controllers/clothingController');

router.post('/upload-clothes', upload.array('clothes', 10), uploadClothes);

module.exports = router;
