const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Add index for faster queries
  indexes: [
    { user: 1, product: 1 },
    { product: 1 }
  ]
});

// Ensure each user can only favorite a product once
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

// Pre-save middleware to check if product exists
favoriteSchema.pre('save', async function(next) {
  try {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.product);
    if (!product) {
      throw new Error('Product not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to check if a product is favorited by a user
favoriteSchema.statics.isProductFavoritedByUser = async function(userId, productId) {
  return await this.exists({ user: userId, product: productId });
};

// Static method to get user's favorite products
favoriteSchema.statics.getUserFavorites = async function(userId, options = {}) {
  const { page = 1, limit = 10 } = options;
  
  return await this.find({ user: userId })
    .populate('product')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get product's favorite count
favoriteSchema.statics.getProductFavoriteCount = async function(productId) {
  return await this.countDocuments({ product: productId });
};

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
