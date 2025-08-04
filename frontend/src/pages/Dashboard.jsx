import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

function Dashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('post');
  
  // Content state
  const [userPosts, setUserPosts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0
  });
  
  // Form states
  const [postForm, setPostForm] = useState({
    title: '', content: '', category: 'Fashion Trends', image: ''
  });
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'Clothing', image: '', stock: ''
  });

  // Refs for animations
  const dashboardRef = useRef(null);
  const statsRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  // API base URL
  const API_BASE = `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api`;

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const ctx = gsap.context(() => {
        // Stats animation
        gsap.fromTo(statsRef.current?.children || [],
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
        );

        // Tabs animation
        gsap.fromTo(tabsRef.current?.children || [],
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.3 }
        );

        // Content animation
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
        );
      }, dashboardRef);

      return () => ctx.revert();
    }
  }, [isAuthenticated, activeTab, loading]);

  // Authentication functions
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        await fetchDashboardData();
        loadCartAndFavorites();
      } else {
        console.log('Auth check failed:', await response.text());
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user posts
      const postsResponse = await fetch(`${API_BASE}/posts/my-posts`, { headers });
      if (!postsResponse.ok) {
        throw new Error(`Failed to fetch posts: ${postsResponse.statusText}`);
      }
      const postsData = await postsResponse.json();
      const posts = postsData?.data || [];
      setUserPosts(posts);

      // Fetch user products
      const productsResponse = await fetch(`${API_BASE}/products/my-products`, { headers });
      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
      }
      const productsData = await productsResponse.json();
      const products = productsData?.data || [];
      setUserProducts(products);

      // Calculate stats from the fresh data
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      const totalSales = products.reduce((sum, product) => sum + (product.sales || 0), 0);
      
      setStats({
        totalPosts: posts.length,
        totalProducts: products.length,
        totalViews,
        totalSales
      });

    } catch (error) {
      console.error('Fetch dashboard data error:', error);
      setStats({
        totalPosts: 0,
        totalProducts: 0,
        totalViews: 0,
        totalSales: 0
      });
      setUserPosts([]);
      setUserProducts([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setUserPosts([]);
    setUserProducts([]);
  };

  // Content handlers
  const handleAddPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postForm)
      });

      if (response.ok) {
        const data = await response.json();
        setUserPosts([data.data, ...userPosts]);
        setPostForm({ title: '', content: '', category: 'Fashion Trends', image: '' });
        setShowAddModal(false);
        await fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error creating post');
      }
    } catch (error) {
      console.error('Add post error:', error);
      alert('Error creating post');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        const data = await response.json();
        setUserProducts([data.data, ...userProducts]);
        setProductForm({ name: '', description: '', price: '', category: 'Clothing', image: '', stock: '' });
        setShowAddModal(false);
        await fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error creating product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      alert('Error creating product');
    }
  };

  // Cart handlers
  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        const updatedItem = { 
          ...item, 
          quantity: newQuantity,
          total: (item.price * newQuantity).toFixed(2)
        };
        return updatedItem;
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const addToCartFromFavorites = (product) => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      updateCartQuantity(product._id, existingItem.quantity + 1);
    } else {
      const newItem = { 
        ...product, 
        quantity: 1,
        total: product.price.toFixed(2)
      };
      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Favorites handlers
  const removeFromFavorites = (id) => {
    const updatedFavorites = favoriteProducts.filter((product) => product._id !== id);
    setFavoriteProducts(updatedFavorites);
    
    // Update localStorage
    const savedLikes = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    const updatedLikes = savedLikes.filter(likeId => likeId !== id);
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
  };

  // Load cart and favorites from localStorage
  const loadCartAndFavorites = () => {
    try {
      // Load cart items
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartWithTotals = savedCart.map(item => ({
        ...item,
        total: (item.price * item.quantity).toFixed(2)
      }));
      setCartItems(cartWithTotals);

      // Load favorite products
      const savedLikes = JSON.parse(localStorage.getItem('likedProducts') || '[]');
      // We need to fetch the actual product data for favorites
      fetchFavoriteProducts(savedLikes);
    } catch (error) {
      console.error('Error loading cart and favorites:', error);
    }
  };

  // Fetch favorite products data
  const fetchFavoriteProducts = async (favoriteIds) => {
    if (favoriteIds.length === 0) {
      setFavoriteProducts([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const favorites = data.products.filter(product => 
          favoriteIds.includes(product._id)
        );
        setFavoriteProducts(favorites);
      }
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      // Fallback: create sample favorites
      const sampleFavorites = getSampleFavorites(favoriteIds);
      setFavoriteProducts(sampleFavorites);
    }
  };

  // Sample favorites for fallback
  const getSampleFavorites = (favoriteIds) => {
    const sampleProducts = [
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
      }
    ];
    
    return sampleProducts.filter(product => favoriteIds.includes(product._id));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <NavBar />
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">Please sign in to access your dashboard</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Stats
  const dashboardStats = [
    { label: 'Total Posts', value: stats.totalPosts, icon: 'fas fa-blog', color: 'blue' },
    { label: 'Total Products', value: stats.totalProducts, icon: 'fas fa-box', color: 'green' },
    { label: 'Total Views', value: stats.totalViews, icon: 'fas fa-eye', color: 'purple' },
    { label: 'Total Sales', value: stats.totalSales, icon: 'fas fa-chart-line', color: 'orange' }
  ];

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
                <p className="text-gray-600">Manage your content and track performance</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <i className={`${stat.icon} ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                  } text-xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div ref={tabsRef} className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8">
          {[
            { key: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
            { key: 'posts', label: 'My Posts', icon: 'fas fa-blog', count: userPosts.length },
            { key: 'products', label: 'My Products', icon: 'fas fa-box', count: userProducts.length },
            { key: 'cart', label: 'Cart', icon: 'fas fa-shopping-cart', count: cartItems.length },
            { key: 'favorites', label: 'Favorites', icon: 'fas fa-heart', count: favoriteProducts.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              <span className="flex items-center">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={contentRef}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {userPosts.slice(0, 3).map((post) => (
                    <div key={post._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{post.title}</h4>
                        <p className="text-sm text-gray-600">{post.views || 0} views • {post.likes || 0} likes</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                  {userPosts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No posts yet. Create your first post!</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="space-y-4">
                  {userProducts.slice(0, 3).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">${product.price} • {product.sales || 0} sold</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.stock} in stock
                      </span>
                    </div>
                  ))}
                  {userProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No products yet. Add your first product!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Posts</h3>
                <button
                  onClick={() => {setShowAddModal(true); setModalType('post');}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Post
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{post.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{post.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{post.views || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userPosts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No posts found. Create your first post!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
                <button
                  onClick={() => {setShowAddModal(true); setModalType('product');}}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.sales || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No products found. Add your first product!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Cart</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">${item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cartItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Favorites</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {favoriteProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {favoriteProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You have no favorite products.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New {modalType === 'post' ? 'Post' : 'Product'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <form onSubmit={modalType === 'post' ? handleAddPost : handleAddProduct} className="p-6 space-y-4">
              {modalType === 'post' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Fashion Trends</option>
                      <option>Style Tips</option>
                      <option>Sustainability</option>
                      <option>Brand Stories</option>
                      <option>Seasonal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                    <input
                      type="url"
                      value={postForm.image}
                      onChange={(e) => setPostForm({...postForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>Clothing</option>
                      <option>Accessories</option>
                      <option>Shoes</option>
                      <option>Bags</option>
                      <option>Jewelry</option>
                      <option>Beauty</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com/product.jpg"
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 ${modalType === 'post' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-lg transition-colors duration-200`}
                >
                  Add {modalType === 'post' ? 'Post' : 'Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
      {/* Cart and Favorites Tabs */}
      {activeTab === 'cart' && (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
          {cartItems.length > 0 ? (
            <div>
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">Price: ${item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateCartQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">Total: ${item.total}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={clearCart}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Favorite Products</h2>
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProducts.map((product) => (
                <div key={product._id} className="border rounded p-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => addToCartFromFavorites(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromFavorites(product._id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No favorite products yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;