import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function FashionTrending() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const seeMoreRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  // Trending data with online images
  const trendingData = [
    {
      id: 1,
      title: "Japanese Minimalist",
      description: "Clean lines and subtle elegance",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&crop=center",
      category: "Asian Fashion"
    },
    {
      id: 2,
      title: "American Streetwear",
      description: "Bold and urban contemporary style",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop&crop=center",
      category: "Street Style"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, descriptionRef.current, seeMoreRef.current], {
        opacity: 0,
        y: 30
      });

      gsap.set([leftCardRef.current, rightCardRef.current], {
        opacity: 0,
        y: 60,
        scale: 0.9
      });

      // Create scroll trigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate header elements
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      })
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .to(seeMoreRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.3")
      // Animate cards with stagger
      .to([leftCardRef.current, rightCardRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Add hover animations for cards
      [leftCardRef, rightCardRef].forEach((ref) => {
        if (ref.current) {
          const handleMouseEnter = () => {
            gsap.to(ref.current, {
              scale: 1.02,
              y: -5,
              duration: 0.3,
              ease: "power2.out"
            });
          };

          const handleMouseLeave = () => {
            gsap.to(ref.current, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          };

          ref.current.addEventListener('mouseenter', handleMouseEnter);
          ref.current.addEventListener('mouseleave', handleMouseLeave);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='w-full px-4 sm:px-6 lg:px-10 py-12 lg:py-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 lg:mb-16 space-y-4 lg:space-y-0'>
          <div className='space-y-3'>
            <h2 ref={titleRef} className='text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900'>
              Outfit of The Trending
            </h2>
            <p ref={descriptionRef} className='text-gray-600 text-base lg:text-lg max-w-2xl leading-relaxed'>
              Step into the Limelight with Outfit of the Trending. Elevate Your Wardrobe and Flaunt a Fresh, 
              Contemporary Style that Defines Modern Fashion.
            </p>
          </div>

          <button 
            ref={seeMoreRef}
            className='text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center gap-2 hover:gap-3 transition-all duration-200 group'
          >
            See more
            <i className='fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-200'></i>
          </button>
        </div>

        {/* Trending Cards Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          {trendingData.map((trend, index) => (
            <div 
              key={trend.id}
              ref={index === 0 ? leftCardRef : rightCardRef}
              className='group cursor-pointer'
            >
              {/* Image Container */}
              <div className='relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl mb-6'>
                <img 
                  src={trend.image} 
                  alt={trend.title}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                
                {/* Category Badge */}
                <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
                  <span className='text-xs font-medium text-gray-800'>{trend.category}</span>
                </div>
                
                {/* Hover Content */}
                <div className='absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'>
                  <button className='bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2'>
                    <i className='fas fa-eye text-xs'></i>
                    View Collection
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className='space-y-2'>
                <h3 className='text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200'>
                  {trend.title}
                </h3>
                <p className='text-gray-600 text-sm lg:text-base'>
                  {trend.description}
                </p>
                <button className='text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 mt-3 group-hover:gap-3 transition-all duration-200'>
                  <i className='fas fa-arrow-right text-xs'></i>
                  Explore Trend
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className='mt-16 lg:mt-20 text-center'>
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12'>
            <h3 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-4'>
              Discover More Trending Styles
            </h3>
            <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
              Stay ahead of fashion trends with our curated collection of the latest styles from around the world.
            </p>
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
              Browse All Trends
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FashionTrending