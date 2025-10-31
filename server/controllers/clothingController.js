const ClothingItem = require('../models/clothingItem');

// Upload multiple clothes handler
exports.uploadClothes = async (req, res) => {
  try {
    console.log('Files received:', req.files);
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    const categories = req.body.categories || [];
    const clothes = files.map((file, idx) => ({
      filename: file.filename,
      originalName: file.originalname,
      category: categories[idx] || 'uncategorized'
    }));

    const savedClothes = await ClothingItem.insertMany(clothes);

    res.json({ message: 'Clothes uploaded successfully', clothes: savedClothes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload clothes' });
  }
};
