
const ClothingItem = require('../models/clothingItem');
const path = require('path');
const fs = require('fs');

exports.uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: 'No files uploaded' });

  try {
    const uploadedItems = [];

    for (let file of req.files) {
      const uniqueName = Date.now() + '-' + file.originalname;
      const targetPath = path.join(__dirname, '../uploads/', uniqueName);
      fs.renameSync(file.path, targetPath);

      // Save to MongoDB using only fields in your schema
      const newItem = new ClothingItem({
        filename: uniqueName,
        originalName: file.originalname
      });
      await newItem.save();

      uploadedItems.push(newItem); // <- collects saved items to return
    }

    res.status(200).json({
      message: `${req.files.length} files uploaded successfully`,
      files: uploadedItems // <- frontend can use this array
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};
exports.getAllClothes = async (req, res) => {
  try {
    const clothes = await ClothingItem.find().sort({ uploadedAt: -1 }); // latest first
    res.json(clothes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};