require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const clothingRoutes = require('./routes/clothingRoutes');
const path = require('path');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', clothingRoutes);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
