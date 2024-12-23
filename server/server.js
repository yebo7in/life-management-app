const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-netlify-app.netlify.app'
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const todoRoutes = require('./routes/todos');
const eventRoutes = require('./routes/events');
const noteRoutes = require('./routes/notes');
const shareRoutes = require('./routes/shares');

// Add route middleware
app.use('/api/todos', todoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/shares', shareRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 