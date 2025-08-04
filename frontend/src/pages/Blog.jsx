import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const blogRef = useRef(null);
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const postsRef = useRef(null);
  const sidebarRef = useRef(null);

  // Blog categories
  const categories = ['All', 'Fashion Trends', 'Style Tips', 'Sustainability', 'Brand Stories', 'Seasonal'];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Sustainable Fashion: Trends to Watch in 2024",
      excerpt: "Discover the latest innovations in eco-friendly fashion and how brands are revolutionizing the industry with sustainable practices.",
      category: "Sustainability",
      author: "Emma Rodriguez",
      date: "December 15, 2023",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: 2,
      title: "10 Essential Wardrobe Pieces Every Fashion Lover Needs",
      excerpt: "Build a timeless wardrobe with these versatile pieces that will keep you stylish for years to come.",
      category: "Style Tips",
      author: "Sarah Johnson",
      date: "December 12, 2023",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: 3,
      title: "Spring 2024 Fashion Trends: What's Hot This Season",
      excerpt: "From vibrant colors to bold patterns, explore the fashion trends that are defining the spring season.",
      category: "Fashion Trends",
      author: "Michael Chen",
      date: "December 10, 2023",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: 4,
      title: "Behind the Scenes: How Dressify Creates Its Collections",
      excerpt: "Take a peek into our design process and learn how we bring fashion ideas from concept to reality.",
      category: "Brand Stories",
      author: "David Kim",
      date: "December 8, 2023",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: 5,
      title: "Styling Tips: How to Mix and Match Patterns Like a Pro",
      excerpt: "Master the art of pattern mixing with these expert tips and create stunning, cohesive outfits.",
      category: "Style Tips",
      author: "Emma Rodriguez",
      date: "December 5, 2023",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: 6,
      title: "Winter Fashion Essentials: Stay Warm and Stylish",
      excerpt: "Discover the must-have winter pieces that combine comfort, warmth, and style for the colder months.",
      category: "Seasonal",
      author: "Sarah Johnson",
      date: "December 3, 2023",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
      featured: false
    }
  ];

  // Filter posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.set([heroRef.current.children], {
        opacity: 0,
        y: 60
      });

      const heroTl = gsap.timeline();
      heroTl.to(heroRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      // Featured posts animation
      gsap.fromTo(featuredRef.current.children,
        {
          opacity: 0,
          y: 80,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Categories animation
      gsap.fromTo(categoriesRef.current.children,
        {
          opacity: 0,
          x: -30
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Blog posts animation
      gsap.fromTo(postsRef.current.children,
        {
          opacity: 0,
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: postsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Sidebar animation
      gsap.fromTo(sidebarRef.current.children,
        {
          opacity: 0,
          x: 50
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sidebarRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, blogRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Animate category change
    gsap.fromTo(postsRef.current.children,
      { opacity: 0.7, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }
    );
  };

  return (
    <div ref={blogRef} className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={heroRef} className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Fashion{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the latest fashion trends, style tips, and industry insights. 
              Stay ahead of the curve with our expert fashion content.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Articles
            </h2>
            <p className="text-xl text-gray-600">
              Our most popular and trending fashion content
            </p>
          </div>

          <div ref={featuredRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {featuredPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {post.category}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-gray-200 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-gray-300 text-sm">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Categories Filter */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h3>
                <div ref={categoriesRef} className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Posts Grid */}
              <div ref={postsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <span>{post.author}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{post.date}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div ref={sidebarRef} className="space-y-8">
                
                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
                  <p className="mb-6 opacity-90">
                    Get the latest fashion insights delivered to your inbox.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Fashion', 'Style', 'Trends', 'Sustainable', 'Wardrobe', 'Accessories', 'Seasonal', 'Tips'].map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h4>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex space-x-4 group cursor-pointer">
                        <img 
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h5>
                          <p className="text-gray-500 text-xs mt-1">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;