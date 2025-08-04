import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Aboutus() {
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroImageRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const statsRef = useRef(null);

  // Team data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "Fashion visionary with 15+ years in luxury retail"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Award-winning designer from Milan Fashion Week"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Head of Sustainability",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Environmental advocate transforming fashion industry"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Technology Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Tech innovator creating seamless shopping experiences"
    }
  ];

  // Company values
  const values = [
    {
      id: 1,
      icon: "fas fa-heart",
      title: "Passion for Fashion",
      description: "We live and breathe fashion, bringing you the latest trends with authentic style and creativity."
    },
    {
      id: 2,
      icon: "fas fa-leaf",
      title: "Sustainability First",
      description: "Committed to ethical practices and sustainable fashion that respects our planet and communities."
    },
    {
      id: 3,
      icon: "fas fa-users",
      title: "Customer Obsessed",
      description: "Your satisfaction drives everything we do. We're here to make your fashion journey extraordinary."
    },
    {
      id: 4,
      icon: "fas fa-star",
      title: "Quality Excellence",
      description: "Premium materials, exceptional craftsmanship, and attention to detail in every piece we offer."
    }
  ];

  // Company stats
  const stats = [
    { id: 1, number: "50K+", label: "Happy Customers" },
    { id: 2, number: "1000+", label: "Fashion Items" },
    { id: 3, number: "25+", label: "Countries Served" },
    { id: 4, number: "99%", label: "Satisfaction Rate" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animations
      gsap.set([heroTitleRef.current, heroSubtitleRef.current], {
        opacity: 0,
        y: 60
      });
      
      gsap.set(heroImageRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: -5
      });

      const heroTl = gsap.timeline();
      heroTl
        .to(heroTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "back.out(1.7)"
        })
        .to(heroSubtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .to(heroImageRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(1.7)"
        }, "-=0.8");

      // Story Section Animation
      gsap.fromTo(storyRef.current.children, 
        {
          opacity: 0,
          y: 80,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Values Section Animation
      gsap.fromTo(valuesRef.current.children,
        {
          opacity: 0,
          y: 60,
          rotationY: 45
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Team Section Animation
      gsap.fromTo(teamRef.current.children,
        {
          opacity: 0,
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stats Counter Animation
      stats.forEach((stat, index) => {
        const element = statsRef.current.children[index];
        const numberElement = element.querySelector('.stat-number');
        
        gsap.fromTo(numberElement,
          { textContent: 0 },
          {
            textContent: stat.number,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Floating animations for hero image
      gsap.to(heroImageRef.current, {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="text-center lg:text-left space-y-8">
              <h1 ref={heroTitleRef} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                About{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dressify
                </span>
              </h1>
              <p ref={heroSubtitleRef} className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Redefining fashion with passion, sustainability, and innovation. 
                We're not just a brand – we're a movement towards conscious, 
                beautiful, and accessible fashion for everyone.
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div ref={heroImageRef} className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop&crop=center"
                  alt="Fashion team collaboration"
                  className="w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020 with a simple yet powerful vision: to make high-quality, 
                  sustainable fashion accessible to everyone. What started as a small team 
                  of passionate designers has grown into a global community of fashion lovers.
                </p>
                <p>
                  We believe that fashion should be a force for good – empowering individuals 
                  to express themselves while respecting our planet and the people who make 
                  our clothes. Every piece in our collection tells a story of craftsmanship, 
                  sustainability, and style.
                </p>
                <p>
                  Today, we're proud to serve customers in over 25 countries, offering 
                  carefully curated collections that blend contemporary trends with 
                  timeless elegance.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=500&fit=crop&crop=center"
                alt="Fashion design process"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-lg">Since 2020</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our commitment to you and our planet.
            </p>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <i className={`${value.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Dressify, working together to revolutionize fashion.
            </p>
          </div>

          <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Numbers that reflect our commitment to excellence and our growing community.
            </p>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="stat-number text-4xl lg:text-6xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Aboutus;