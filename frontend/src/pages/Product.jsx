import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for adding products
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Clothing',
    description: '',
    stock: '',
    image: null,
    imagePreview: null
  });

  // Refs for animations
  const heroRef = useRef(null);
  const filtersRef = useRef(null);
  const productsGridRef = useRef(null);
  const addButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Categories
  const categories = ['All', 'Clothing', 'Accessories', 'Shoes', 'Bags', 'Jewelry', 'Beauty'];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: 'power2.out'
        }
      );

      // Filters animation
      gsap.fromTo(filtersRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out'
        }
      );

      // Products grid animation
      gsap.fromTo(productsGridRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.5,
          ease: 'power2.out'
        }
      );

      // Add button animation (if authenticated)
      if (isAuthenticated && addButtonRef.current) {
        gsap.fromTo(addButtonRef.current,
          { scale: 0, rotation: -180 },
          { 
            scale: 1, 
            rotation: 0, 
            duration: 0.8,
            delay: 0.7,
            ease: 'back.out(1.7)'
          }
        );
      }
    });

    return () => ctx.revert();
  }, [isAuthenticated, loading]);

  // Modal animations
  useEffect(() => {
    if (showAddModal && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.4,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, [showAddModal]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        // If API fails, use sample data
        setProducts(getSampleProducts());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  const getSampleProducts = () => [
    {
      _id: '1',
      name: 'Premium Leather Jacket',
      price: 299,
      category: 'Clothing',
      description: 'High-quality leather jacket with modern design',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'
    },
    {
      _id: '2',
      name: 'Designer Handbag',
      price: 199,
      category: 'Bags',
      description: 'Elegant designer handbag for any occasion',
      stock: 8,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    },
    {
      _id: '3',
      name: 'Luxury Watch',
      price: 599,
      category: 'Accessories',
      description: 'Premium timepiece with Swiss movement',
      stock: 5,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
    },
    {
      _id: '4',
      name: 'Running Shoes',
      price: 129,
      category: 'Shoes',
      description: 'Comfortable running shoes for active lifestyle',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      _id: '5',
      name: 'Gold Necklace',
      price: 399,
      category: 'Jewelry',
      description: 'Elegant gold necklace with pendant',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    },
    {
      _id: '6',
      name: 'Skincare Set',
      price: 89,
      category: 'Beauty',
      description: 'Complete skincare routine set',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProductForm({
        ...productForm,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to add products');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('description', productForm.description);
      formData.append('stock', productForm.stock);
      
      if (productForm.image) {
        formData.append('image', productForm.image);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to local state with image preview or uploaded image URL
        const newProduct = {
          ...data.product,
          image: productForm.imagePreview || data.product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
        };
        
        setProducts(prev => [newProduct, ...prev]);
        
        // Reset form
        setProductForm({
          name: '',
          price: '',
          category: 'Clothing',
          description: '',
          stock: '',
          image: null,
          imagePreview: null
        });
        
        // Close modal with animation
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 50,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => setShowAddModal(false)
        });

        // Success animation
        gsap.fromTo(addButtonRef.current,
          { scale: 1 },
          { 
            scale: 1.2, 
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
          }
        );

      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setShowAddModal(false)
      });
    } else {
      setShowAddModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover our curated collection of premium fashion items, carefully selected for style and quality.
          </p>
          
          {/* Add Product Button (for authenticated users) */}
          {isAuthenticated && (
            <button
              ref={addButtonRef}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-8"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Product
            </button>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <section ref={filtersRef} className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={productsGridRef} className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        <p className="text-xs text-gray-500">{product.stock} in stock</p>
                      </div>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <i className="fas fa-shopping-cart mr-1"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 relative">
                  {productForm.imagePreview ? (
                    <div className="relative">
                      <img
                        src={productForm.imagePreview}
                        alt="Preview"
                        className="mx-auto h-48 w-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setProductForm({...productForm, image: null, imagePreview: null})}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                      >
                        <i className="fas fa-times text-sm"></i>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Product