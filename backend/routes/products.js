const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Favorite = require('../models/Favorite');
const { protect, generateToken } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = Router();

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Allow anonymous access but handle auth token if present
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token invalid or expired - continue as anonymous user
        console.log('Invalid token in products request:', err.message);
      }
    }

    const { 
      page = 1, 
      limit = 12, 
      category, 
      status = 'active', 
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { status };
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('seller', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    // Add favorite information to products
    const productsWithFavorites = await Promise.all(
      products.map(async (product) => {
        const productObj = product.toObject();
        if (userId) {
          const [isFavorited, favoriteCount] = await Promise.all([
            Favorite.isProductFavoritedByUser(userId, product._id),
            Favorite.getProductFavoriteCount(product._id)
          ]);
          productObj.isFavorite = !!isFavorited;
          productObj.favoriteCount = favoriteCount;
        } else {
          productObj.favoriteCount = await Favorite.getProductFavoriteCount(product._id);
          productObj.isFavorite = false;
        }
        return productObj;
      })
    );

    res.json({
      success: true,
      data: productsWithFavorites,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products'
    });
  }
});

// @desc    Get user's products
// @route   GET /api/products/my-products
// @access  Private
router.get('/my-products', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to access your products'
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    
    const query = { seller: req.user.id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Check for authentication but don't require it
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Invalid token - continue as anonymous user
        console.log('Invalid token in product detail request:', err.message);
      }
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id).populate('seller', 'name avatar');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add isFavorite field and favorite count if user is authenticated
    const productObj = product.toObject();
    if (userId) {
      const [isFavorited, favoriteCount] = await Promise.all([
        Favorite.isProductFavoritedByUser(userId, product._id),
        Favorite.getProductFavoriteCount(product._id)
      ]);
      productObj.isFavorite = !!isFavorited;
      productObj.favoriteCount = favoriteCount;
    } else {
      // Just get favorite count for anonymous users
      productObj.favoriteCount = await Favorite.getProductFavoriteCount(product._id);
      productObj.isFavorite = false;
    }

    res.json({
      success: true,
      data: productObj
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
router.post('/', protect, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .isIn(['Clothing', 'Accessories', 'Shoes', 'Bags', 'Jewelry', 'Beauty'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      name, 
      description, 
      price, 
      category, 
      images, 
      stock, 
      specifications,
      tags,
      status = 'active'
    } = req.body;

    // Validate price and stock
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price format'
      });
    }

    if (isNaN(parsedStock)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock format'
      });
    }

    const product = await Product.create({
      name,
      description,
      price: parsedPrice,
      category,
      images: images || [],
      stock: parsedStock,
      specifications: specifications || {},
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      status,
      seller: req.user.id
    });

    await product.populate('seller', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .optional()
    .isIn(['Clothing', 'Accessories', 'Shoes', 'Bags', 'Jewelry', 'Beauty'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const { 
      name, 
      description, 
      price, 
      category, 
      images, 
      stock, 
      specifications,
      tags,
      status
    } = req.body;

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (category) product.category = category;
    if (images) product.images = images;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (specifications) product.specifications = specifications;
    if (tags) product.tags = tags.split(',').map(tag => tag.trim());
    if (status) product.status = status;

    await product.save();
    await product.populate('seller', 'name avatar');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
});

// @desc    Get dashboard stats
// @route   GET /api/products/dashboard/stats
// @access  Private
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to access dashboard stats'
      });
    }

    const sellerId = mongoose.Types.ObjectId(req.user.id);

    const [
      totalProducts,
      activeProducts,
      totalSales,
      totalRevenue
    ] = await Promise.all([
      Product.countDocuments({ seller: sellerId }),
      Product.countDocuments({ seller: sellerId, status: 'active' }),
      Product.aggregate([
        { $match: { seller: sellerId } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$sales', 0] } } } }
      ]),
      Product.aggregate([
        { $match: { seller: sellerId } },
        { $group: { _id: null, total: { $sum: { 
          $multiply: [
            { $ifNull: ['$sales', 0] }, 
            { $ifNull: ['$price', 0] }
          ] 
        } } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalSales: totalSales[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard stats'
    });
  }
});

module.exports = router;
