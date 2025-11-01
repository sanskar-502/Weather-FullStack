require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

const app = express();

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'https://weather-fullstack-vwdi.onrender.com'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/search', limiter);

app.use('/api/weather', require('./routes/weather'));
app.use('/api/search', require('./routes/search'));
app.use('/api/users', require('./routes/user'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});