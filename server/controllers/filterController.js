// server/controllers/filterController.js
const supabase = require('../config/supabase');

// Color palette matching rules (bidirectional)
const colorPalette = {
  red: ["black", "white", "blue", "grey"],
  blue: ["white", "black", "grey", "beige", "red"],
  green: ["brown", "black", "white", "beige"],
  black: ["white", "grey", "red", "blue", "yellow", "orange", "pink", "green", "purple"],
  white: ["black", "blue", "grey", "brown", "red", "green", "yellow", "purple", "orange", "pink"],
  yellow: ["black", "white", "blue", "grey"],
  purple: ["black", "white", "grey", "beige"],
  brown: ["beige", "white", "black", "green", "orange"],
  orange: ["black", "white", "blue", "brown"],
  pink: ["black", "white", "grey", "blue"],
  grey: ["black", "white", "blue", "red", "yellow", "green", "purple", "pink"],
  beige: ["brown", "white", "black", "blue", "green"]
};

exports.filterOutfits = async (req, res) => {
  try {
    const { occasions, colors, clothesType, selectedColor, findMatching } = req.body;
    let query = supabase.from('outfit_metadata').select('*');

    // Occasion filter
    if (occasions && occasions.length > 0) {
      query = query.in('occasion', occasions);
    }

    // Color filter (old way)
    if (colors && colors.length > 0) {
      query = query.in('color', colors);
    }

    // Clothes palette filter
    if (clothesType && selectedColor) {
      if (findMatching) {
        // Find matching opposite items
        const oppositeType = clothesType === 'shirt' ? 'pant' : 'shirt';
        const matchingColors = colorPalette[selectedColor] || [];
        query = query.eq('category', oppositeType).in('color', matchingColors);
      } else {
        // Show items in selected color
        query = query.eq('category', clothesType).eq('color', selectedColor);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Filter error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};