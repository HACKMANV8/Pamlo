const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const wardrobeController = require('../controllers/clothingController');

// This must be a function reference, not wardrobeController.uploadImages()
router.post('/upload-clothes', upload.array('clothes', 12), wardrobeController.uploadImages);
router.get('/clothes', wardrobeController.getAllClothes);

module.exports = router;
