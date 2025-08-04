const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fashion Trends', 'Style Tips', 'Sustainability', 'Brand Stories', 'Seasonal'],
    default: 'Fashion Trends'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&crop=center'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

// Create excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(' ').length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Index for better search performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Post', postSchema);
