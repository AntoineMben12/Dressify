import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import heroMain from '../assets/hero_main.jpg';
import mage1 from '../assets/mage1.jpg';
import mage2 from '../assets/mage2.jpg';
import mage3 from '../assets/mage3.jpg';
import mage4 from '../assets/mage4.jpg';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Hero = () => {
  const sectionRef = useRef(null);
  const heroImageRef = useRef(null);
  const animatedTextRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const floatingCardsRef = useRef([]);
  const productCardsRef = useRef([]);
  const backgroundRef = useRef(null);
  const particlesRef = useRef([]);

  const heroImages = [heroMain, mage1, mage2, mage3, mage4];
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create floating particles
      createFloatingParticles();

      // Background gradient animation
      gsap.to(backgroundRef.current, {
        backgroundPosition: '200% 50%',
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      // Hero image carousel with 3D effect
      const imageCarousel = gsap.timeline({ repeat: -1 });
      heroImages.forEach((_, index) => {
        imageCarousel
          .to(heroImageRef.current, {
            rotationY: index === 0 ? 0 : 360,
            scale: 1.1,
            duration: 0.8,
            ease: 'power2.inOut'
          })
          .to(heroImageRef.current, {
            rotationY: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.inOut'
          })
          .call(() => setCurrentImageIndex((index + 1) % heroImages.length))
          .to({}, { duration: 2 }); // Hold duration
      });

      // Animated text with typewriter effect
      const textTimeline = gsap.timeline();
      textTimeline
        .fromTo(animatedTextRef.current, 
          { opacity: 0, scale: 0.5, rotationX: -90 },
          { 
            opacity: 1, 
            scale: 1, 
            rotationX: 0,
            duration: 1.2,
            ease: 'back.out(1.7)'
          }
        )
        .to(animatedTextRef.current, {
          text: {
            value: "Discover Your Perfect Style",
            delimiter: ""
          },
          duration: 2,
          ease: 'none'
        }, 0.5);

      // Description animation with wave effect
      gsap.fromTo(descriptionRef.current,
        { 
          opacity: 0, 
          y: 50,
          filter: 'blur(10px)'
        },
        { 
          opacity: 1, 
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          delay: 1.5,
          ease: 'power2.out'
        }
      );

      // Button with magnetic effect
      gsap.fromTo(buttonRef.current,
        { 
          opacity: 0, 
          scale: 0,
          rotation: -180
        },
        { 
          opacity: 1, 
          scale: 1,
          rotation: 0,
          duration: 0.8,
          delay: 2,
          ease: 'back.out(1.7)'
        }
      );

      // Floating cards with physics simulation
      floatingCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            { 
              opacity: 0, 
              y: 100,
              rotationX: -45,
              scale: 0.8
            },
            { 
              opacity: 1, 
              y: 0,
              rotationX: 0,
              scale: 1,
              duration: 1,
              delay: 2.5 + (index * 0.2),
              ease: 'back.out(1.7)'
            }
          );

          // Continuous floating animation
          gsap.to(card, {
            y: -20,
            rotation: index % 2 === 0 ? 5 : -5,
            duration: 3 + (index * 0.5),
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          });
        }
      });

      // Product cards with stagger and 3D effect
      gsap.fromTo(productCardsRef.current,
        { 
          opacity: 0, 
          y: 80,
          rotationY: -45,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 3,
          ease: 'back.out(1.7)'
        }
      );

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.to(sectionRef.current, {
            scale: 1.02,
            duration: 0.5,
            ease: 'power2.out'
          });
        },
        onLeave: () => {
          gsap.to(sectionRef.current, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const createFloatingParticles = () => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-white/20 rounded-full pointer-events-none';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      backgroundRef.current?.appendChild(particle);
      particlesRef.current.push(particle);

      gsap.to(particle, {
        y: -100,
        x: Math.random() * 200 - 100,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        delay: Math.random() * 2,
        ease: 'power1.out'
      });
    }
  };

  // Interactive button hover effect
  const handleButtonHover = (isHovering) => {
    gsap.to(buttonRef.current, {
      scale: isHovering ? 1.1 : 1,
      rotationY: isHovering ? 10 : 0,
      boxShadow: isHovering ? '0 20px 40px rgba(59, 130, 246, 0.4)' : '0 10px 20px rgba(59, 130, 246, 0.2)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Product card hover effect
  const handleProductHover = (index, isHovering) => {
    const card = productCardsRef.current[index];
    if (card) {
      gsap.to(card, {
        y: isHovering ? -10 : 0,
        rotationY: isHovering ? 5 : 0,
        scale: isHovering ? 1.05 : 1,
        boxShadow: isHovering ? '0 25px 50px rgba(0, 0, 0, 0.2)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden animate-on-scroll"
    >
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600"
        style={{
          backgroundSize: '400% 400%',
          backgroundPosition: '0% 50%'
        }}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 
                ref={animatedTextRef}
                className="text-5xl md:text-7xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Fashion Forward
              </h1>
              
              <p 
                ref={descriptionRef}
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl"
              >
                Elevate your wardrobe with our curated collection of premium fashion pieces. 
                From timeless classics to cutting-edge trends.
              </p>
              
              <button
                ref={buttonRef}
                className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl"
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
              >
                Explore Collection
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>

            {/* Floating Stats Cards */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { label: 'Happy Customers', value: '10K+', icon: 'fas fa-users' },
                { label: 'Premium Brands', value: '50+', icon: 'fas fa-star' },
                { label: 'Countries', value: '25+', icon: 'fas fa-globe' }
              ].map((stat, index) => (
                <div
                  key={index}
                  ref={el => floatingCardsRef.current[index] = el}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20"
                >
                  <i className={`${stat.icon} text-2xl text-white mb-2 block`}></i>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative">
              <img
                ref={heroImageRef}
                src={heroImages[currentImageIndex]}
                alt="Fashion Hero"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
                style={{ 
                  filter: 'brightness(1.1) contrast(1.1)',
                  transform: 'perspective(1000px)'
                }}
              />
              
              {/* Image Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-80 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Premium Jacket', price: '$299', image: mage1 },
              { name: 'Designer Dress', price: '$199', image: mage2 },
              { name: 'Luxury Accessories', price: '$149', image: mage3 }
            ].map((product, index) => (
              <div
                key={index}
                ref={el => productCardsRef.current[index] = el}
                className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 cursor-pointer"
                onMouseEnter={() => handleProductHover(index, true)}
                onMouseLeave={() => handleProductHover(index, false)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-yellow-400">{product.price}</p>
                  <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-all duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <i className="fas fa-chevron-down text-2xl"></i>
      </div>
    </section>
  );
};

export default Hero;
