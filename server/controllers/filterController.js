// server/controllers/filterController.js
const supabase = require('../config/supabase');

exports.filterOutfits = async (req, res) => {
  try {
    const { occasions, colors } = req.body;
    let query = supabase.from('outfit_metadata').select('*');

    if (occasions && occasions.length > 0) {
      query = query.in('occasion', occasions);
    }

    if (colors && colors.length > 0) {
      query = query.in('color', colors);
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
