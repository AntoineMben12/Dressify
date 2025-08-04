import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function OurProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Refs for animations
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const productsGridRef = useRef(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Load cart and liked products from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const savedLikes = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    setCart(savedCart);
    setLikedProducts(new Set(savedLikes));
  }, []);

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  // GSAP Animations
  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      const ctx = gsap.context(() => {
        // Header animation
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: -30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            ease: 'power2.out'
          }
        );

        // Products grid animation
        gsap.fromTo(productsGridRef.current.children,
          { 
            opacity: 0, 
            y: 50, 
            scale: 0.9 
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: productsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, filteredProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        const productsWithLikes = data.products.map(product => ({
          ...product,
          likes: product.likes || Math.floor(Math.random() * 50) + 5 // Random likes if not in DB
        }));
        setProducts(productsWithLikes);
      } else {
        // Fallback to sample data if API fails
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
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      likes: 42
    },
    {
      _id: '2',
      name: 'Designer Handbag',
      price: 199,
      category: 'Bags',
      description: 'Elegant designer handbag for any occasion',
      stock: 8,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      likes: 38
    },
    {
      _id: '3',
      name: 'Luxury Watch',
      price: 599,
      category: 'Accessories',
      description: 'Premium timepiece with Swiss movement',
      stock: 5,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      likes: 67
    },
    {
      _id: '4',
      name: 'Running Shoes',
      price: 129,
      category: 'Shoes',
      description: 'Comfortable running shoes for active lifestyle',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      likes: 29
    },
    {
      _id: '5',
      name: 'Gold Necklace',
      price: 399,
      category: 'Jewelry',
      description: 'Elegant gold necklace with pendant',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      likes: 51
    },
    {
      _id: '6',
      name: 'Skincare Set',
      price: 89,
      category: 'Beauty',
      description: 'Complete skincare routine set',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      likes: 33
    }
  ];

  const handleAddToCart = (product, event) => {
    const existingItem = cart.find(item => item._id === product._id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Success animation with proper event target
    if (event && event.currentTarget) {
      gsap.fromTo(event.currentTarget,
        { scale: 1 },
        { 
          scale: 1.1, 
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        }
      );
    }
  };

  const handleLikeProduct = async (product, event) => {
    if (!isAuthenticated) {
      alert('Please login to like products');
      return;
    }

    const isLiked = likedProducts.has(product._id);
    const newLikedProducts = new Set(likedProducts);
    
    if (isLiked) {
      newLikedProducts.delete(product._id);
    } else {
      newLikedProducts.add(product._id);
    }
    
    setLikedProducts(newLikedProducts);
    localStorage.setItem('likedProducts', JSON.stringify([...newLikedProducts]));
    
    // Update product likes count
    const updatedProducts = products.map(p =>
      p._id === product._id
        ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    );
    setProducts(updatedProducts);
    
    // Try to update likes on server
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/products/${product._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: isLiked ? 'unlike' : 'like' })
      });
    } catch (error) {
      console.error('Error updating like:', error);
    }
    
    // Like animation with proper event target
    if (event && event.currentTarget) {
      gsap.fromTo(event.currentTarget,
        { scale: 1 },
        { 
          scale: 1.3, 
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'back.out(1.7)'
        }
      );
    }
  };

  const getCartItemCount = (productId) => {
    const item = cart.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <section className='w-full h-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 mt-4 lg:mt-8'>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className='w-full h-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 mt-4 lg:mt-8'>
      {/* Header Section */}
      <div ref={headerRef} className='w-full mb-6 lg:mb-8'>
        {/* Desktop Layout */}
        <div className='hidden md:flex justify-between items-center mb-4'>
          <div>
            <h2 className='text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900'>
              Our Products
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          <div className='relative'>
            <div className='flex border border-gray-300 rounded-xl items-center px-3 py-2 gap-2 transition-all duration-200 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white shadow-sm'>
              <i className="fas fa-search text-gray-400 text-sm"></i>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:outline-none w-48 lg:w-64 text-sm placeholder-gray-500" 
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden space-y-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
                Our Products
              </h2>
              <p className="text-gray-600 text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className='p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors bg-white shadow-sm'
            >
              <i className={`fas ${isSearchVisible ? 'fa-times' : 'fa-search'} text-gray-600`}></i>
            </button>
          </div>
          
          {/* Mobile Search Bar */}
          {isSearchVisible && (
            <div className='w-full'>
              <div className='flex border border-gray-300 rounded-xl items-center px-3 py-2 gap-2 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white shadow-sm'>
                <i className="fas fa-search text-gray-400 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:outline-none flex-1 text-sm placeholder-gray-500" 
                  autoFocus
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className='w-full'>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No products match "${searchTerm}"` : 'No products available'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                    }}
                  />
                  
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikeProduct(product, e)}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      likedProducts.has(product._id)
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <i className={`fas fa-heart ${likedProducts.has(product._id) ? 'text-white' : ''}`}></i>
                  </button>

                  {/* Stock Badge */}
                  {product.stock <= 5 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Only {product.stock} left
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {product.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Likes Count */}
                  <div className="flex items-center mb-4 text-sm text-gray-500">
                    <i className="fas fa-heart text-red-400 mr-1"></i>
                    <span>{product.likes} {product.likes === 1 ? 'like' : 'likes'}</span>
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <p className="text-xs text-gray-500">{product.stock} in stock</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Cart Count Badge */}
                      {getCartItemCount(product._id) > 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getCartItemCount(product._id)} in cart
                        </span>
                      )}
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.stock === 0}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <i className="fas fa-shopping-cart mr-1"></i>
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OurProduct