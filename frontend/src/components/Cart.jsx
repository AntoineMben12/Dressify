
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { category } from '../assets/assets.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const categories = [
  'All', 'Shirt', 'Trouser', 'Shorts', 'Cap', 'Jacket',
  'Hoodie', 'Shoe', 'Sock', 'Watch', 'Glasses'
];

// Extract products from category data and add web images for additional variety
const allProducts = [
  { id: 1, ...category.shirt[0], favorite: false }, // Black Hoodie Shirt
  { id: 2, ...category.shirt[1], favorite: false }, // Diamond Striped Shirt
  { id: 3, ...category.shirt[2], favorite: true }, // Oversized Gray Shirt
  { id: 4, ...category.shirt[3], favorite: false }, // Men Plus Light
  { id: 5, ...category.trousers[0], favorite: false }, // Man Chino Trousers
  { id: 6, ...category.bag[0], favorite: false }, // Handbag Shoulder Bag
  { id: 7, ...category.shoes[0], favorite: true }, // Women Latte Shoes
  { id: 8, ...category.cap[0], favorite: false }, // Green Cap
  // Additional products with web images
  { id: 9, name: 'Classic Denim Jacket', price: 75.00, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop', category: 'jacket', favorite: false },
  { id: 10, name: 'Cotton Hoodie', price: 45.00, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', category: 'hoodie', favorite: false },
  { id: 11, name: 'Running Shoes', price: 85.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', category: 'shoe', favorite: true },
  { id: 12, name: 'Cotton Socks', price: 12.00, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop', category: 'sock', favorite: false },
  { id: 13, name: 'Smart Watch', price: 199.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: 'watch', favorite: false },
  { id: 14, name: 'Sunglasses', price: 65.00, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', category: 'glasses', favorite: false },
  { id: 15, name: 'Summer Shorts', price: 35.00, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', category: 'shorts', favorite: false },
  { id: 16, name: 'Casual Trouser', price: 55.00, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', category: 'trouser', favorite: false },
];

const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      // Set initial state
      gsap.set(card, { 
        opacity: 0, 
        y: 50, 
        scale: 0.9,
        rotationY: 15
      });

      // Create scroll trigger animation
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: index * 0.1, // Stagger effect
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });

      // Hover animation
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.05,
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === card) {
            trigger.kill();
          }
        });
      };
    }
  }, [index]);

  return (
    <div ref={cardRef} className=" rounded-lg p-2 relative hover:shadow-md transition-shadow">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <button className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${product.favorite ? 'text-red-500' : 'text-white'} shadow-lg`}>
        <span className="text-xs">{product.favorite ? '♥' : '♡'}</span>
      </button>
      <h3 className="mt-2 text-sm">{product.name}</h3>
      <p className="text-gray-800 font-semibold">${product.price.toFixed(2)}</p>
    </div>
  );
};

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const categoriesRef = useRef(null);
  const countRef = useRef(null);
  const paginationRef = useRef(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? allProducts 
    : allProducts.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // GSAP animations for main elements
  useEffect(() => {
    // Animate categories on mount
    if (categoriesRef.current) {
      const categoryButtons = categoriesRef.current.children;
      gsap.fromTo(categoryButtons, 
        { 
          opacity: 0, 
          y: -30, 
          scale: 0.8 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }

    // Animate product count
    if (countRef.current) {
      gsap.fromTo(countRef.current,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.5,
          delay: 0.3
        }
      );
    }

    // Animate pagination
    if (paginationRef.current) {
      gsap.fromTo(paginationRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.8
        }
      );
    }
  }, []);

  // Animate elements when category changes
  useEffect(() => {
    if (countRef.current) {
      gsap.fromTo(countRef.current,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3
        }
      );
    }
  }, [selectedCategory, currentPage]);

  return (
    <div className="w-full pr-10">
      {/* Categories */}
      <div ref={categoriesRef} className="flex justify-between w-full my-6 flex-wrap gap-2">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1 rounded-full text-sm border transition-all duration-200 transform hover:scale-105 ${
              selectedCategory === cat 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                : 'text-gray-700 hover:bg-gray-200 border-gray-300 hover:shadow-md'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Count */}
      <div ref={countRef} className="mb-4 text-sm text-gray-600">
        Showing {currentProducts.length} of {filteredProducts.length} products
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div ref={paginationRef} className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-all duration-200 ${
                num === currentPage 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-300'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

