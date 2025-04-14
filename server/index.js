require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    
    if (Object.keys(req.query).length > 0) {
      console.log(`Query params: ${JSON.stringify(req.query, null, 2)}`);
    }
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
    }
    
    console.log('-----------------------------------');
    next();
  });
}

// Routes
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Atlas connection error:', error);
  }); 