const mongoose = require('mongoose');

const ClothingItemSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: String,
  category: {
    type: String,
    default: 'uncategorized'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClothingItem', ClothingItemSchema);
