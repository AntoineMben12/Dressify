import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const authButtonsRef = useRef([]);
  const mobileMenuRef = useRef(null);
  
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      
      if (navRef.current) {
        gsap.to(navRef.current, {
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
          boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo entrance animation
      gsap.fromTo(logoRef.current, 
        { opacity: 0, x: -30, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );

      // Navigation links staggered animation
      gsap.fromTo(linksRef.current, 
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power2.out',
          delay: 0.2
        }
      );

      // Auth buttons animation
      gsap.fromTo(authButtonsRef.current, 
        { opacity: 0, x: 30, scale: 0.8 },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.4
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Mobile menu animations
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      // Overlay animation
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });

      // Menu container animation
      gsap.set(menuRef.current, { 
        opacity: 0, 
        scale: 0.8, 
        transformOrigin: 'top right', 
        y: -20,
        rotationY: -15
      });
      gsap.to(menuRef.current, { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotationY: 0,
        duration: 0.4, 
        ease: 'back.out(1.7)' 
      });

      // Menu items staggered animation
      const menuItems = menuRef.current.querySelectorAll('.menu-item');
      gsap.fromTo(menuItems, 
        { opacity: 0, x: 30, rotationX: -45 },
        { 
          opacity: 1, 
          x: 0, 
          rotationX: 0,
          duration: 0.5, 
          stagger: 0.1, 
          ease: 'power2.out',
          delay: 0.2
        }
      );
    }
  }, [menuOpen]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLogout = () => {
    // Logout animation
    gsap.to(authButtonsRef.current, {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.2,
      onComplete: () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
        
        // Reset animation
        gsap.to(authButtonsRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      }
    });
  };

  const toggleMenu = () => {
    if (menuOpen) {
      // Close animation
      const menuItems = menuRef.current?.querySelectorAll('.menu-item');
      if (menuItems) {
        gsap.to(menuItems, {
          opacity: 0,
          x: 30,
          rotationX: -45,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in'
        });
      }
      
      gsap.to(menuRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -20,
        rotationY: -15,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setMenuOpen(false)
      });
    } else {
      setMenuOpen(true);
    }
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        toggleMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [menuOpen]);

  // Navigation links with hover animations
  const NavLink = ({ to, children, className = "", external = false }) => {
    const linkRef = useRef(null);
    
    const handleMouseEnter = () => {
      gsap.to(linkRef.current, {
        y: -2,
        scale: 1.05,
        color: '#3B82F6',
        duration: 0.3,
        ease: 'power2.out'
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(linkRef.current, {
        y: 0,
        scale: 1,
        color: scrolled ? '#374151' : '#FFFFFF',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    if (external) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          ref={linkRef}
          className={`transition-all duration-300 hover:text-blue-500 ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        to={to}
        ref={linkRef}
        className={`transition-all duration-300 hover:text-blue-500 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
            : 'bg-white/10 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div ref={logoRef} className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                  !scrolled ? 'text-white' : ''
                }`}>
                  Dressify
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/aboutus', label: 'About' },
                  { to: '/products', label: 'Products' },
                  { to: '/blog', label: 'Blog' },
                  { to: 'http://ngwemmbenfrontend.onrender.com', label: 'Portfolio', external: true }
                ].map((link, index) => (
                  <div
                    key={link.to}
                    ref={el => linksRef.current[index] = el}
                  >
                    <NavLink
                      to={link.to}
                      external={link.external}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        scrolled 
                          ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                          : 'text-white hover:text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                      {link.external && <i className="fas fa-external-link-alt ml-1 text-xs"></i>}
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div
                    ref={el => authButtonsRef.current[0] = el}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      scrolled ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    Welcome, {user?.name}!
                  </div>
                  <NavLink
                    to="/dashboard"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    Dashboard
                  </NavLink>
                  <button
                    ref={el => authButtonsRef.current[1] = el}
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transform hover:scale-105 transition-all duration-300 ${
                      scrolled 
                        ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
                        : 'border-white text-white hover:bg-white/10'
                    }`}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  scrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                }`}
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}></span>
                  <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    menuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-16 right-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 md:hidden border border-gray-200/50"
        >
          <div className="py-6 px-4 space-y-2">
            {[
              { to: '/', label: 'Home', icon: 'fas fa-home' },
              { to: '/aboutus', label: 'About', icon: 'fas fa-info-circle' },
              { to: '/product', label: 'Products', icon: 'fas fa-shopping-bag' },
              { to: '/blog', label: 'Blog', icon: 'fas fa-blog' },
              { to: 'https://your-portfolio-link.com', label: 'Portfolio', icon: 'fas fa-briefcase', external: true }
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                external={link.external}
                className="menu-item flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                onClick={() => !link.external && toggleMenu()}
              >
                <i className={`${link.icon} mr-3 w-5`}></i>
                {link.label}
                {link.external && <i className="fas fa-external-link-alt ml-auto text-xs"></i>}
              </NavLink>
            ))}

            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated ? (
                <>
                  <div className="menu-item px-4 py-2 text-sm text-gray-600">
                    Welcome, {user?.name}!
                  </div>
                  <NavLink
                    to="/dashboard"
                    className="menu-item flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    <i className="fas fa-tachometer-alt mr-3 w-5"></i>
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="menu-item w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-5"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="menu-item flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    <i className="fas fa-sign-in-alt mr-3 w-5"></i>
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="menu-item flex items-center px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    <i className="fas fa-user-plus mr-3 w-5"></i>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;