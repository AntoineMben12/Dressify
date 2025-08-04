const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const productRoutes = require('./routes/products');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Add more detailed error information
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Could not connect to any MongoDB servers.');
      console.error('Please check:');
      console.error('1. Your network connection');
      console.error('2. MongoDB Atlas IP whitelist settings');
      console.error('3. Your connection string in the .env file');
    }
    return false;
  }
};

// Connect to database
(async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('\n⚠️  Warning: Server starting without database connection');
    console.log('❗ Some features may not work properly\n');
  }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dressify API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Simple test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend connection successful!',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Dressify API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      products: '/api/products',
      health: '/api/health',
      test: '/api/test'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
console.log(`Using backend port: ${PORT}`);

const server = app.listen(PORT, () => {
  console.log(`
🚀 Dressify API Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📊 Health Check: http://localhost:${PORT}/api/health
📚 API Documentation: http://localhost:${PORT}/
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop other processes using this port or change the PORT in your .env file.`);
    process.exit(1);
  } else {
    console.error('Server startup error:', err);
    process.exit(1);
  }
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
