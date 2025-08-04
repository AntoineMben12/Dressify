import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const sectionsRef = useRef([]);
  const socialRef = useRef([]);
  const newsletterRef = useRef(null);
  const separatorRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer entrance animation
      gsap.fromTo(footerRef.current,
        { 
          opacity: 0, 
          y: 100,
          filter: 'blur(10px)'
        },
        { 
          opacity: 1, 
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Logo animation with rotation
      gsap.fromTo(logoRef.current,
        { 
          opacity: 0, 
          scale: 0.5,
          rotation: -180
        },
        { 
          opacity: 1, 
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Sections staggered animation
      gsap.fromTo(sectionsRef.current,
        { 
          opacity: 0, 
          y: 50,
          rotationX: -45
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Social icons with bounce effect
      gsap.fromTo(socialRef.current,
        { 
          opacity: 0, 
          scale: 0,
          rotation: -360
        },
        { 
          opacity: 1, 
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Newsletter section animation
      gsap.fromTo(newsletterRef.current,
        { 
          opacity: 0, 
          x: -100,
          filter: 'blur(5px)'
        },
        { 
          opacity: 1, 
          x: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Separator line animation
      gsap.fromTo(separatorRef.current,
        { 
          scaleX: 0,
          opacity: 0
        },
        { 
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: separatorRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Bottom section slide up
      gsap.fromTo(bottomRef.current,
        { 
          opacity: 0, 
          y: 30
        },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bottomRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Social icon hover effects
  const handleSocialHover = (index, isHovering) => {
    const icon = socialRef.current[index];
    if (icon) {
      gsap.to(icon, {
        scale: isHovering ? 1.2 : 1,
        rotation: isHovering ? 15 : 0,
        y: isHovering ? -5 : 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Newsletter input focus effect
  const handleInputFocus = (isFocused) => {
    const input = newsletterRef.current?.querySelector('input');
    if (input) {
      gsap.to(input, {
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused ? '0 0 20px rgba(59, 130, 246, 0.3)' : '0 0 0px rgba(59, 130, 246, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden animate-on-scroll"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div ref={el => sectionsRef.current[0] = el} className="space-y-6">
            <div ref={logoRef} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dressify
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering fashion entrepreneurs with modern e-commerce tools. 
              Discover, create, and share your unique style with the world.
            </p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Quick Links */}
          <div ref={el => sectionsRef.current[1] = el} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Products', href: '/product' },
                { name: 'Blog', href: '/blog' },
                { name: 'Dashboard', href: '/dashboard' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group"
                  >
                    <i className="fas fa-chevron-right mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div ref={el => sectionsRef.current[2] = el} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Contact Us', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'FAQ', href: '#' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group"
                  >
                    <i className="fas fa-chevron-right mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div ref={el => sectionsRef.current[3] = el} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-300">
              Subscribe to our newsletter for the latest fashion trends and exclusive offers.
            </p>
            <div ref={newsletterRef} className="space-y-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  onFocus={() => handleInputFocus(true)}
                  onBlur={() => handleInputFocus(false)}
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-r-lg transition-all duration-300 transform hover:scale-105">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              <p className="text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div 
          ref={separatorRef}
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"
        />

        {/* Social Links & Copyright */}
        <div ref={bottomRef} className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Social Media Icons */}
          <div className="flex space-x-6">
            {[
              { icon: 'fab fa-facebook-f', href: '#', color: 'hover:text-blue-500' },
              { icon: 'fab fa-twitter', href: '#', color: 'hover:text-blue-400' },
              { icon: 'fab fa-instagram', href: '#', color: 'hover:text-pink-500' },
              { icon: 'fab fa-linkedin-in', href: '#', color: 'hover:text-blue-600' },
              { icon: 'fab fa-youtube', href: '#', color: 'hover:text-red-500' },
              { icon: 'fab fa-tiktok', href: '#', color: 'hover:text-gray-300' }
            ].map((social, index) => (
              <a
                key={index}
                ref={el => socialRef.current[index] = el}
                href={social.href}
                className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 border border-white/20 hover:border-white/40`}
                onMouseEnter={() => handleSocialHover(index, true)}
                onMouseLeave={() => handleSocialHover(index, false)}
              >
                <i className={`${social.icon} text-lg`}></i>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right space-y-2">
            <p className="text-gray-300">
              2024 Dressify. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with <i className="fas fa-heart text-red-500 mx-1"></i> by the Dressify Team
            </p>
          </div>
        </div>

        {/* Portfolio Link */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <a
            href="http://ngwemmbenfrontend.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 group"
          >
            <i className="fas fa-briefcase group-hover:rotate-12 transition-transform duration-300"></i>
            <span>View Developer Portfolio</span>
            <i className="fas fa-external-link-alt text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"></i>
          </a>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-500/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </footer>
  );
};

export default Footer;