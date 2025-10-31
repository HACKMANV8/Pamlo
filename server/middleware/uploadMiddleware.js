const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = require('multer')({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;
