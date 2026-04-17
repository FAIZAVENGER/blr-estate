import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Camera, Upload, Trash2, User, 
  Mail, Phone, MapPin, Briefcase, Award, 
  Edit2, Save, X, ImageIcon, CheckCircle, Building2,
  Instagram, Facebook, Twitter, Linkedin, Sparkles, Crown, Star,
  TrendingUp, Heart, Shield, Zap, Clock, Calendar, ThumbsUp,
  Globe, Target, Coffee, Gift, HeartHandshake, Rocket, Users,
  Home, ChevronRight, ChevronLeft
} from 'lucide-react';
import { portfolioAPI } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PortfolioPage = ({ isOwner, userRole, setCurrentPage }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(7);
  
  // Refs for GSAP animations
  const mainContainerRef = useRef(null);
  const slideContainerRef = useRef(null);
  const slidesRef = useRef([]);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const bioRef = useRef(null);
  const achievementsRef = useRef(null);
  const socialRef = useRef(null);
  const statItemsRef = useRef([]);
  const serviceCardsRef = useRef([]);
  const testimonialCardsRef = useRef([]);
  const floatingElementsRef = useRef([]);
  const progressBarRef = useRef(null);
  
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
  
  const [photos, setPhotos] = useState([
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  ]);

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
    loadPortfolioInBackground();
    createFloatingElements();
    initSlideAnimations();
  }, []);

  const initSlideAnimations = () => {
    // Animate first slide on load
    setTimeout(() => {
      animateSlideIn(0);
    }, 100);
  };

  const animateSlideIn = (index) => {
    const slide = slidesRef.current[index];
    if (!slide) return;

    // Kill any ongoing animations
    gsap.killTweensOf(slide);
    
    // Reset slide styles
    gsap.set(slide, { 
      opacity: 0, 
      scale: 0.95,
      y: 50,
      rotationX: -15,
      filter: "blur(10px)"
    });
    
    // Animate slide in
    gsap.to(slide, {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationX: 0,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power3.out",
      clearProps: "all"
    });

    // Animate progress bar
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${((index + 1) / totalSlides) * 100}%`,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const animateSlideOut = (index, direction) => {
    const slide = slidesRef.current[index];
    if (!slide) return Promise.resolve();

    return new Promise((resolve) => {
      gsap.to(slide, {
        opacity: 0,
        scale: 0.9,
        y: direction === 'next' ? -50 : 50,
        rotationX: direction === 'next' ? 15 : -15,
        filter: "blur(10px)",
        duration: 0.5,
        ease: "power2.in",
        onComplete: resolve
      });
    });
  };

  const nextSlide = async () => {
    if (currentSlide < totalSlides - 1) {
      await animateSlideOut(currentSlide, 'next');
      setCurrentSlide(currentSlide + 1);
      animateSlideIn(currentSlide + 1);
    }
  };

  const prevSlide = async () => {
    if (currentSlide > 0) {
      await animateSlideOut(currentSlide, 'prev');
      setCurrentSlide(currentSlide - 1);
      animateSlideIn(currentSlide - 1);
    }
  };

  const goToSlide = async (index) => {
    if (index !== currentSlide && index >= 0 && index < totalSlides) {
      await animateSlideOut(currentSlide, index > currentSlide ? 'next' : 'prev');
      setCurrentSlide(index);
      animateSlideIn(index);
    }
  };

  const createFloatingElements = () => {
    const container = document.getElementById('portfolio-container');
    if (container) {
      for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.className = 'floating-particle';
        element.style.position = 'absolute';
        element.style.width = Math.random() * 4 + 1 + 'px';
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

  const loadPortfolioInBackground = async () => {
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
        if (response.data.photos && response.data.photos.length > 0) {
          setPhotos(response.data.photos);
        }
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
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

  return (
    <div id="portfolio-container" ref={mainContainerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div ref={progressBarRef} className="h-full bg-gradient-to-r from-[#d4af37] to-amber-500 w-0 transition-all duration-500" style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}></div>
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

      {/* Slide Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-3">
        {[...Array(totalSlides)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === i ? 'bg-[#d4af37] w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`fixed left-6 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 ${
          currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        }`}
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 ${
          currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        }`}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

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

      <div ref={slideContainerRef} className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Slide 1 - Hero */}
        <div ref={el => slidesRef.current[0] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8">
          <div ref={heroRef} className="max-w-7xl mx-auto w-full">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="relative h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute -bottom-20 left-8">
                  <div className="relative group">
                    <div className="profile-image w-36 h-36 rounded-full border-4 border-[#d4af37] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-2xl">
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
                  <Crown className="w-10 h-10 text-[#d4af37] animate-pulse" />
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
                        className="text-center bg-gradient-to-br from-white/10 to-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10"
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

        {/* Slide 2 - Bio */}
        <div ref={el => slidesRef.current[1] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 opacity-0">
          <div ref={bioRef} className="max-w-4xl mx-auto w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-900" />
              </div>
              About Me
            </h2>
            {isEditing ? (
              <textarea
                className="w-full border-2 border-white/20 rounded-xl p-6 h-48 resize-none focus:outline-none focus:border-[#d4af37] transition-all duration-300 bg-white/5 text-white text-lg"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            ) : (
              <p className="text-gray-300 leading-relaxed text-xl">{formData.bio}</p>
            )}
          </div>
        </div>

        {/* Slide 3 - Services */}
        <div ref={el => slidesRef.current[2] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 opacity-0">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">What I Offer</h2>
              <p className="text-gray-400 text-lg">Comprehensive real estate services tailored to your needs</p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  ref={el => serviceCardsRef.current[index] = el}
                  className={`group relative overflow-hidden bg-gradient-to-br ${service.color} bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform duration-300">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 4 - Testimonials */}
        <div ref={el => slidesRef.current[3] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 opacity-0">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Client Testimonials</h2>
              <p className="text-gray-400 text-lg">What my clients say about working with me</p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  ref={el => testimonialCardsRef.current[index] = el}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-start gap-5">
                    <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                          <p className="text-sm text-[#d4af37]">{testimonial.role}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mt-4 leading-relaxed">"{testimonial.content}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 5 - Achievements */}
        <div ref={el => slidesRef.current[4] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 opacity-0">
          <div ref={achievementsRef} className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Achievements & Recognition</h2>
              <p className="text-gray-400 text-lg">Awards and accolades that speak for themselves</p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievementsList.map((achievement, index) => (
                <div key={index} className={`bg-gradient-to-br ${achievement.color} bg-opacity-10 rounded-2xl p-8 text-center backdrop-blur-sm border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                  <achievement.icon className="w-14 h-14 text-[#d4af37] mx-auto mb-4" />
                  <div className="text-xl font-bold text-white">{achievement.title}</div>
                  <div className="text-3xl font-bold text-[#d4af37] mt-2">{achievement.year}</div>
                  <div className="text-sm text-gray-400 mt-3">{achievement.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 6 - Social & Contact */}
        <div ref={el => slidesRef.current[5] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 opacity-0">
          <div className="max-w-4xl mx-auto w-full text-center">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Crown className="w-12 h-12 text-gray-900" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Let's Connect</h2>
              <p className="text-gray-300 text-lg mb-8">Follow me on social media for updates and insights</p>
              
              <div ref={socialRef} className="flex justify-center gap-6 mb-8">
                <a href={formData.socialLinks?.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-12 border border-white/20">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href={formData.socialLinks?.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-rotate-12 border border-white/20">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href={formData.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-6 border border-white/20">
                  <Twitter className="w-6 h-6 text-white" />
                </a>
                <a href={formData.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-rotate-6 border border-white/20">
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-gray-400">📞 +91 97386 34402</p>
                <p className="text-gray-400 mt-2">✉️ {formData.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 7 - Closing / Call to Action */}
        <div ref={el => slidesRef.current[6] = el} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 opacity-0">
          <div className="max-w-4xl mx-auto w-full text-center">
            <div className="bg-gradient-to-r from-[#1a1a2e] via-gray-800 to-[#1a1a2e] rounded-3xl p-16 border border-[#d4af37]/30 shadow-2xl">
              <div className="w-28 h-28 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 transform -rotate-12">
                <Rocket className="w-14 h-14 text-gray-900" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Work Together?</h2>
              <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
                Let's find your dream property or discuss investment opportunities
              </p>
              <button
                onClick={() => setCurrentPage('home')}
                className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-amber-500 text-gray-900 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/30 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Browse Properties
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
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
          animation: floatParticle 8s infinite;
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage;
