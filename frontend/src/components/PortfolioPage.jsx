import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Camera, Upload, Trash2, User, 
  Mail, Phone, MapPin, Briefcase, Award, 
  Edit2, Save, X, ImageIcon, CheckCircle, Building2,
  Instagram, Facebook, Twitter, Linkedin, Sparkles, Crown, Star,
  TrendingUp, Heart, Shield, Zap, Clock, Calendar, ThumbsUp,
  Globe, Target, Coffee, Gift, HeartHandshake, Rocket, Users,
  Home
} from 'lucide-react';
import { portfolioAPI } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PortfolioPage = ({ isOwner, userRole, setCurrentPage }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Refs for GSAP animations
  const mainContainerRef = useRef(null);
  const sectionsRef = useRef([]);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const bioRef = useRef(null);
  const galleryRef = useRef(null);
  const achievementsRef = useRef(null);
  const socialRef = useRef(null);
  const statItemsRef = useRef([]);
  const galleryItemsRef = useRef([]);
  const serviceCardsRef = useRef([]);
  const testimonialCardsRef = useRef([]);
  const floatingElementsRef = useRef([]);
  
  const [formData, setFormData] = useState({
    name: 'Imran Khan',
    title: 'Founder & CEO | Real Estate Expert',
    bio: 'With over 15 years of experience in Bangalore\'s real estate market, I have helped more than 500 families find their dream homes. My passion is connecting people with properties that perfectly match their lifestyle and budget.',
    experience: '15+ Years',
    propertiesSold: '500+',
    rating: '4.9',
    email: 'imrankhan@a1builders.com',
    phone: '+91 97386 34402',
    location: 'Bangalore, India',
    socialLinks: {
      instagram: 'https://instagram.com/imrankhan',
      facebook: 'https://facebook.com/imrankhan',
      twitter: 'https://twitter.com/imrankhan',
      linkedin: 'https://linkedin.com/in/imrankhan'
    }
  });
  
  const [photos, setPhotos] = useState([]);

  // Additional content for portfolio
  const services = [
    { icon: Home, title: 'Property Consultation', desc: 'Expert guidance to find your perfect home', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, title: 'Market Analysis', desc: 'Data-driven insights for smart investments', color: 'from-purple-500 to-pink-500' },
    { icon: Shield, title: 'Legal Assistance', desc: 'Complete legal verification & support', color: 'from-green-500 to-emerald-500' },
    { icon: Zap, title: 'Quick Deal Closure', desc: 'Fast and transparent transaction process', color: 'from-orange-500 to-red-500' },
    { icon: Heart, title: 'Customer Support', desc: '24/7 dedicated support team', color: 'from-rose-500 to-pink-500' },
    { icon: Globe, title: 'Pan Bangalore Service', desc: 'Covering all prime locations', color: 'from-indigo-500 to-blue-500' }
  ];

  const testimonials = [
    { name: 'Rahul Mehta', role: 'Homeowner', content: 'Imran helped me find my dream home in Whitefield. His expertise and patience made the process seamless!', rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Priya Sharma', role: 'Investor', content: 'Outstanding service! Got excellent returns on my property investment.', rating: 5, image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Amit Kumar', role: 'First-time Buyer', content: 'Imran guided me through every step. Highly recommended for first-time buyers!', rating: 5, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Neha Gupta', role: 'NRI Client', content: 'Professional and trustworthy. Handled everything remotely with perfection.', rating: 5, image: 'https://randomuser.me/api/portraits/women/4.jpg' }
  ];

  const achievementsList = [
    { title: 'Top Agent Award', year: '2023', desc: 'Bangalore Real Estate Summit', icon: Award, color: 'from-yellow-500 to-amber-500' },
    { title: 'Customer Satisfaction', year: '2024', desc: '98% Positive Reviews', icon: ThumbsUp, color: 'from-green-500 to-emerald-500' },
    { title: 'Highest Sales Volume', year: '2023', desc: '₹50Cr+ Property Sold', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
    { title: 'Trusted Partner', year: '2024', desc: 'A1 Builders Excellence Award', icon: Crown, color: 'from-purple-500 to-pink-500' }
  ];

  useEffect(() => {
    loadPortfolio();
    createFloatingElements();
  }, []);

  const createFloatingElements = () => {
    const container = document.getElementById('portfolio-container');
    if (container) {
      for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.className = 'floating-particle';
        element.style.position = 'absolute';
        element.style.width = Math.random() * 4 + 2 + 'px';
        element.style.height = element.style.width;
        element.style.background = `rgba(212, 175, 55, ${Math.random() * 0.3})`;
        element.style.borderRadius = '50%';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.pointerEvents = 'none';
        container.appendChild(element);
        floatingElementsRef.current.push(element);
      }
    }
  };

  // GSAP Animations
  useEffect(() => {
    if (!loading && portfolio) {
      // Create ScrollTrigger for each section - Slide effect
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.fromTo(section,
            { opacity: 0, y: 100, rotationX: -15, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 15%",
                toggleActions: "play reverse play reverse",
                scrub: 0.5,
              }
            }
          );
        }
      });

      // Hero section with parallax
      gsap.fromTo(heroRef.current,
        { opacity: 0, scale: 0.8, y: 100, rotationY: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationY: 0,
          duration: 1.5,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stats with elastic animation
      gsap.fromTo(statItemsRef.current,
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "elastic.out(1, 0.3)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Service cards with 3D flip effect
      gsap.fromTo(serviceCardsRef.current,
        { opacity: 0, rotationY: 90, scale: 0.5 },
        {
          opacity: 1,
          rotationY: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: document.querySelector('.services-section'),
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Testimonials with slide effect
      gsap.fromTo(testimonialCardsRef.current,
        { opacity: 0, x: (i) => i % 2 === 0 ? -100 : 100, scale: 0.8 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: document.querySelector('.testimonials-section'),
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Gallery items with zoom effect
      gsap.fromTo(galleryItemsRef.current,
        { opacity: 0, scale: 0.5, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Achievements with bounce
      gsap.fromTo(achievementsRef.current,
        { opacity: 0, y: 80, skewY: 5 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: achievementsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Social links with wave effect
      if (socialRef.current && socialRef.current.children) {
        gsap.fromTo(socialRef.current.children,
          { opacity: 0, scale: 0, rotate: 180 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: socialRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Continuous animations
      gsap.to(".profile-image", {
        y: -12,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.to(".pulse-glow", {
        boxShadow: "0 0 20px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.3)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Floating particles animation
      floatingElementsRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: -Math.random() * 100 - 50,
          x: Math.sin(i) * 50,
          opacity: 0,
          duration: Math.random() * 5 + 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 2
        });
      });
    }
  }, [loading, portfolio]);

  const loadPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio();
      if (response.data) {
        setPortfolio(response.data);
        setFormData({
          name: response.data.name || formData.name,
          title: response.data.title || formData.title,
          bio: response.data.bio || formData.bio,
          experience: response.data.experience || formData.experience,
          propertiesSold: response.data.propertiesSold || formData.propertiesSold,
          rating: response.data.rating || formData.rating,
          email: response.data.email || formData.email,
          phone: response.data.phone || formData.phone,
          location: response.data.location || formData.location,
          socialLinks: response.data.socialLinks || formData.socialLinks
        });
        setPhotos(response.data.photos || []);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setPhotos([
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const photoData = reader.result;
          setPhotos(prev => [...prev, photoData]);
          
          if (isOwner) {
            try {
              await portfolioAPI.addPhoto(photoData);
            } catch (error) {
              console.error('Error saving photo:', error);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
    setUploading(false);
  };

  const handleRemovePhoto = async (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    
    if (isOwner) {
      try {
        await portfolioAPI.removePhoto(index);
      } catch (error) {
        console.error('Error removing photo:', error);
      }
    }
  };

  const handleSaveProfile = async () => {
    setUploading(true);
    try {
      const portfolioData = {
        ...formData,
        photos: photos
      };
      await portfolioAPI.updatePortfolio(portfolioData);
      setPortfolio(portfolioData);
      setIsEditing(false);
      setSuccessMessage('✨ Portfolio updated successfully!');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setSuccessMessage('❌ Error saving portfolio. Please try again.');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#d4af37] border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#d4af37] animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-300 font-medium text-lg">Loading Portfolio...</p>
          <div className="mt-2 flex gap-1 justify-center">
            <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="portfolio-container" ref={mainContainerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed top-20 right-4 z-50 animate-slideInRight">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 animate-spin" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="group flex items-center gap-2 text-white/80 hover:text-[#d4af37] transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex gap-3">
              {isOwner && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="relative overflow-hidden group bg-gradient-to-r from-[#d4af37] to-amber-500 text-gray-900 px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/30 transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Portfolio
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
              {isOwner && isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-xl border border-white/30 text-white/80 hover:bg-white/10 transition-all duration-300"
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={uploading}
                    className="bg-gradient-to-r from-[#d4af37] to-amber-500 text-gray-900 px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section - Slide 1 */}
        <div ref={el => sectionsRef.current[0] = el}>
          <div ref={heroRef} className="relative mb-16">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl transform transition-all duration-500 hover:shadow-[#d4af37]/20">
              <div className="relative h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute -bottom-20 left-8">
                  <div className="relative group">
                    <div className="profile-image w-36 h-36 rounded-full border-4 border-[#d4af37] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                      {photos[0] ? (
                        <img src={photos[0]} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <User className="w-14 h-14 text-[#d4af37]" />
                        </div>
                      )}
                    </div>
                    {isOwner && isEditing && (
                      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#d4af37] to-amber-500 text-gray-900 p-2.5 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg">
                        <Camera className="w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="pulse-glow">
                    <Crown className="w-10 h-10 text-[#d4af37] animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="pt-24 pb-10 px-8">
                <div className="flex justify-between items-start flex-wrap gap-6">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        className="text-3xl font-bold text-white mb-2 border-2 border-[#d4af37] rounded-lg px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    ) : (
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent animate-gradient">
                        {formData.name}
                      </h1>
                    )}
                    {isEditing ? (
                      <input
                        type="text"
                        className="text-gray-300 border-2 border-white/20 rounded-lg px-4 py-2 mt-2 bg-transparent focus:outline-none focus:border-[#d4af37] w-full"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-300 mt-2 flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
                        {formData.title}
                      </p>
                    )}
                  </div>
                  <div ref={statsRef} className="flex gap-4">
                    {['experience', 'propertiesSold', 'rating'].map((key, idx) => (
                      <div 
                        key={idx}
                        ref={el => statItemsRef.current[idx] = el}
                        className="text-center bg-gradient-to-br from-white/10 to-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-2xl font-bold text-[#d4af37]">
                          {key === 'rating' ? `⭐ ${formData[key]}` : formData[key]}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {key === 'experience' ? 'Experience' : key === 'propertiesSold' ? 'Properties Sold' : 'Rating'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <Mail className="w-4 h-4 text-[#d4af37]" />
                    {isEditing ? (
                      <input
                        type="email"
                        className="bg-transparent border border-white/20 rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4af37] text-white"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    ) : (
                      <span className="text-gray-300">{formData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <Phone className="w-4 h-4 text-[#d4af37]" />
                    {isEditing ? (
                      <input
                        type="tel"
                        className="bg-transparent border border-white/20 rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4af37] text-white"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    ) : (
                      <span className="text-gray-300">{formData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-transparent border border-white/20 rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4af37] text-white"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    ) : (
                      <span className="text-gray-300">{formData.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section - Slide 2 */}
        <div ref={el => sectionsRef.current[1] = el}>
          <div ref={bioRef} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 mb-12 border border-white/20 transform transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-gray-900" />
              </div>
              About Me
              <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37] to-transparent ml-4"></div>
            </h2>
            {isEditing ? (
              <textarea
                className="w-full border-2 border-white/20 rounded-xl p-5 h-36 resize-none focus:outline-none focus:border-[#d4af37] transition-all duration-300 bg-white/5 text-white"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            ) : (
              <p className="text-gray-300 leading-relaxed text-lg">{formData.bio}</p>
            )}
          </div>
        </div>

        {/* Services Section - Slide 3 */}
        <div ref={el => sectionsRef.current[2] = el} className="services-section mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">What I Offer</h2>
            <p className="text-gray-400">Comprehensive real estate services tailored to your needs</p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                ref={el => serviceCardsRef.current[index] = el}
                className={`group relative overflow-hidden bg-gradient-to-br ${service.color} bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery Section - Slide 4 */}
        <div ref={el => sectionsRef.current[3] = el}>
          <div ref={galleryRef} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gray-900" />
                </div>
                Photo Gallery
                <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37] to-transparent ml-4"></div>
              </h2>
              {isOwner && isEditing && (
                <label className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-amber-500 text-gray-900 px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5">
                  <Upload className="w-4 h-4" />
                  Add Photos
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
            
            {uploading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#d4af37] border-t-transparent"></div>
                <p className="text-sm text-gray-400 mt-3">Uploading photos...</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {photos.map((photo, index) => (
                <div 
                  key={index} 
                  ref={el => galleryItemsRef.current[index] = el}
                  className="relative group overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <img 
                    src={photo} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  {isOwner && isEditing && (
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-white text-xs bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm">Photo {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {photos.length === 0 && (
              <div className="text-center py-16">
                <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-400">No photos added yet</p>
                {isOwner && isEditing && (
                  <label className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-[#d4af37] to-amber-500 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Your First Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Testimonials Section - Slide 5 */}
        <div ref={el => sectionsRef.current[4] = el} className="testimonials-section mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Client Testimonials</h2>
            <p className="text-gray-400">What my clients say about working with me</p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                ref={el => testimonialCardsRef.current[index] = el}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37]" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                        <p className="text-xs text-[#d4af37]">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-3 leading-relaxed">"{testimonial.content}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section - Slide 6 */}
        <div ref={el => sectionsRef.current[5] = el}>
          <div ref={achievementsRef} className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 mb-12 border border-[#d4af37]/30 shadow-2xl transform transition-all duration-500 hover:shadow-[#d4af37]/20">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-gray-900" />
              </div>
              Achievements & Recognition
              <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37] to-transparent ml-4"></div>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievementsList.map((achievement, index) => (
                <div key={index} className={`bg-gradient-to-br ${achievement.color} bg-opacity-10 rounded-xl p-5 text-center backdrop-blur-sm border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                  <achievement.icon className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
                  <div className="text-lg font-bold text-white">{achievement.title}</div>
                  <div className="text-2xl font-bold text-[#d4af37] mt-1">{achievement.year}</div>
                  <div className="text-xs text-gray-400 mt-2">{achievement.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links - Slide 7 */}
        <div ref={el => sectionsRef.current[6] = el}>
          <div ref={socialRef} className="flex justify-center gap-6 mt-8 pb-12">
            <a href={formData.socialLinks?.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-12 border border-white/20">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href={formData.socialLinks?.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-rotate-12 border border-white/20">
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a href={formData.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-6 border border-white/20">
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a href={formData.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-rotate-6 border border-white/20">
              <Linkedin className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .floating-particle {
          position: absolute;
          pointer-events: none;
          animation: float 8s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage;
