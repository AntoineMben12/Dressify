const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all posts (public)
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'published', search } = req.query;
    
    const query = { status };
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting posts'
    });
  }
});

// @desc    Get user's posts
// @route   GET /api/posts/my-posts
// @access  Private
router.get('/my-posts', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { author: req.user.id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user posts'
    });
  }
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting post'
    });
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('category')
    .isIn(['Fashion Trends', 'Style Tips', 'Sustainability', 'Brand Stories', 'Seasonal'])
    .withMessage('Invalid category'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
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

    const { title, content, category, image, tags, status = 'draft' } = req.body;

    // Generate excerpt from content if not provided
    const excerpt = content.length > 150 ? content.substring(0, 150) + '...' : content;

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      image: image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&crop=center',
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      status,
      author: req.user.id
    });

    await post.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating post'
    });
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('category')
    .optional()
    .isIn(['Fashion Trends', 'Style Tips', 'Sustainability', 'Brand Stories', 'Seasonal'])
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

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { title, content, category, image, tags, status } = req.body;

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (image) post.image = image;
    if (tags) post.tags = tags.split(',').map(tag => tag.trim());
    if (status) post.status = status;

    await post.save();
    await post.populate('author', 'name avatar');

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating post'
    });
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting post'
    });
  }
});

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Toggle like (simplified - in production, you'd track individual likes)
    post.likes += 1;
    await post.save();

    res.json({
      success: true,
      message: 'Post liked successfully',
      likes: post.likes
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error liking post'
    });
  }
});

module.exports = router;
