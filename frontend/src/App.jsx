import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Import pages
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Product from './pages/Product';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Page transition component
const PageTransition = ({ children }) => {
  const pageRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(pageRef.current,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.98,
          filter: 'blur(10px)'
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );

      // Create a subtle parallax effect for the page content
      const elements = pageRef.current?.querySelectorAll('.animate-on-scroll');
      if (elements) {
        elements.forEach((element, index) => {
          gsap.fromTo(element,
            { 
              opacity: 0, 
              y: 30,
              rotationX: -15
            },
            { 
              opacity: 1, 
              y: 0,
              rotationX: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={pageRef} className="min-h-screen">
      {children}
    </div>
  );
};

// Loading component with GSAP animation
const LoadingScreen = () => {
  const loadingRef = useRef(null);
  const logoRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo animation
      gsap.fromTo(logoRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          duration: 1,
          ease: 'back.out(1.7)'
        }
      );

      // Dots animation
      gsap.fromTo(dotsRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: 0.5
        }
      );

      // Loading screen exit animation
      setTimeout(() => {
        gsap.to(loadingRef.current, {
          opacity: 0,
          scale: 0.9,
          filter: 'blur(10px)',
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            if (loadingRef.current) {
              loadingRef.current.style.display = 'none';
            }
          }
        });
      }, 2000);
    }, loadingRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={loadingRef}
      className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center z-[9999]"
    >
      <div className="text-center">
        <div 
          ref={logoRef}
          className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl"
        >
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            D
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Dressify</h1>
        <p className="text-white/80 mb-8">Loading your fashion experience...</p>
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              ref={el => dotsRef.current[index] = el}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2500);

    // Smooth scrolling
    const smoothScroll = (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: targetElement, offsetY: 80 },
            ease: 'power2.inOut'
          });
        }
      }
    };

    document.addEventListener('click', smoothScroll);
    return () => document.removeEventListener('click', smoothScroll);
  }, []);

  return (
    <Router>
      {loading && <LoadingScreen />}
      <div className="App">
        <Routes>
          <Route path="/" element={
            <PageTransition>
              <Home />
            </PageTransition>
          } />
          <Route path="/aboutus" element={
            <PageTransition>
              <Aboutus />
            </PageTransition>
          } />
          <Route path="/products" element={
            <PageTransition>
              <Product />
            </PageTransition>
          } />
          <Route path="/blog" element={
            <PageTransition>
              <Blog />
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />
          <Route path="/signup" element={
            <PageTransition>
              <Signup />
            </PageTransition>
          } />
          <Route path="/dashboard" element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;