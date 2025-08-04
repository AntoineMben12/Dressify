const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Electronics', 'Home', 'Sports', 'Beauty', 'Books', 'Other'],
      message: 'Please select a valid category'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  sales: {
    type: Number,
    default: 0,
    min: [0, 'Sales cannot be negative']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  variants: [{
    name: String,
    value: String,
    price: Number,
    stock: Number
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ author: 1 });
productSchema.index({ featured: 1 });

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.stock > 0 && this.status === 'active' && this.isActive;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to update search fields
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('description')) {
    this.searchText = `${this.name} ${this.description} ${this.category}`.toLowerCase();
  }
  next();
});

// Static method to get products with filters
productSchema.statics.getFilteredProducts = function(filters = {}) {
  const {
    page = 1,
    limit = 12,
    category,
    status = 'active',
    search,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    featured,
    author
  } = filters;

  const query = { status, isActive: true };

  // Category filter
  if (category && category !== 'all') {
    query.category = new RegExp(category, 'i');
  }

  // Search filter
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Featured filter
  if (featured !== undefined) {
    query.featured = featured;
  }

  // Author filter
  if (author) {
    query.author = author;
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Pagination
  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('author', 'name email avatar')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));
};

// Instance method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like
productSchema.methods.toggleLike = function(userId) {
  const isLiked = this.likedBy.includes(userId);
  
  if (isLiked) {
    this.likedBy.pull(userId);
    this.likes = Math.max(0, this.likes - 1);
  } else {
    this.likedBy.push(userId);
    this.likes += 1;
  }
  
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
