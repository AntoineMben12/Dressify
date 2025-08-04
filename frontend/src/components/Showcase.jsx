import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jordan4_1 from "../assets/jordan4-1.jpg";
import jordan4_2 from "../assets/jordan4-2.jpg";
import jordan4_3 from "../assets/jordan4-3.jpg";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states with masks
      gsap.set([titleRef.current, descriptionRef.current, buttonRef.current], {
        clipPath: "inset(0 100% 0 0)",
        opacity: 1
      });

      gsap.set([image1Ref.current, image2Ref.current, image3Ref.current], {
        clipPath: "inset(100% 0 0 0)",
        scale: 1.2
      });

      // Create timeline for text animations
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate title with mask reveal
      textTl.to(titleRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "power3.out"
      })
      // Animate description with mask reveal
      .to(descriptionRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      // Animate button with mask reveal
      .to(buttonRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

      // Create timeline for image animations
      const imagesTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate images with mask reveal and scale
      imagesTl.to(image1Ref.current, {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(image2Ref.current, {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .to(image3Ref.current, {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6");

      // Add hover animations for images
      [image1Ref, image2Ref, image3Ref].forEach((ref) => {
        if (ref.current) {
          const handleMouseEnter = () => {
            gsap.to(ref.current, {
              scale: 1.05,
              duration: 0.4,
              ease: "power2.out"
            });
          };

          const handleMouseLeave = () => {
            gsap.to(ref.current, {
              scale: 1,
              duration: 0.4,
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
    <section ref={sectionRef} className="w-full py-8 lg:py-16 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 ref={titleRef} className="text-3xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Discover our Durable and Resilient Clothing Materials
            </h2>
            <p ref={descriptionRef} className="text-lg text-gray-600 leading-relaxed">
              Experience the perfect blend of comfort and durability with our
              premium clothing materials. Each carefully chosen to embody the
              perfect blend of comfort, style, and longevity.
            </p>
            <button ref={buttonRef} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-3 px-6 text-sm font-medium cursor-pointer rounded-lg text-white shadow-lg hover:shadow-xl transform hover:scale-105">
              View More
            </button>
          </div>

          {/* Right Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 h-96">
              <div className="row-span-2 overflow-hidden rounded-lg">
                <img 
                  ref={image1Ref}
                  src={jordan4_1} 
                  alt="Premium clothing material showcase" 
                  className="w-full h-full object-cover shadow-lg" 
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img 
                  ref={image2Ref}
                  src={jordan4_2} 
                  alt="Durable fabric detail" 
                  className="w-full h-full object-cover shadow-lg" 
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img 
                  ref={image3Ref}
                  src={jordan4_3} 
                  alt="Resilient material texture" 
                  className="w-full h-full object-cover shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden space-y-8">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center">
            Discover our Durable and Resilient Clothing Materials
          </h2>

          {/* Images Grid - Mobile */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2">
              <img 
                src={jordan4_1} 
                alt="Premium clothing material showcase" 
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg" 
              />
            </div>
            <div>
              <img 
                src={jordan4_2} 
                alt="Durable fabric detail" 
                className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg" 
              />
            </div>
            <div>
              <img 
                src={jordan4_3} 
                alt="Resilient material texture" 
                className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg" 
              />
            </div>
          </div>

          {/* Content - Mobile */}
          <div className="text-center space-y-6">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed px-4">
              Experience the perfect blend of comfort and durability with our
              premium clothing materials. Each carefully chosen to embody the
              perfect blend of comfort, style, and longevity.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-3 px-6 text-sm font-medium cursor-pointer rounded-lg text-white shadow-lg hover:shadow-xl transform hover:scale-105">
              View More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
