import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, MapPin, Building2, Phone, Mail, Bed, Bath, Square, Heart, 
  Filter, Menu, X, LogOut, Home, Award, Shield, Upload, Wifi, Car, 
  Dumbbell, TreePine, ShieldCheck, Camera, ArrowLeft, MapPinned, Share2, 
  Calendar, Users, Star, CheckCircle, Clock, Eye, RefreshCw, AlertCircle, 
  ChevronRight, User, Image as ImageIcon, Check, Target, Globe, Zap, 
  TrendingUp, Headphones, Users as UsersIcon, Award as AwardIcon, ThumbsUp, 
  FileText, XCircle, Edit2, Trash2, ChevronLeft, Sparkles, Instagram, 
  Facebook, Twitter, Linkedin, Crown, Building, Key, Wallet, 
  Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, 
  Clock as ClockIcon, Calendar as CalendarIcon, CheckCircle as CheckIcon,
  ArrowRight, Quote, Briefcase, Coffee, Gift, HeartHandshake, Maximize, Minimize,
  MessageCircle, Rocket, PlusCircle, Briefcase as BriefcaseIcon
} from 'lucide-react';
import { propertyAPI, authAPI } from './services/api';
import BrochureGenerator from './components/BrochureGenerator';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import PortfolioPage from './components/PortfolioPage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Professional background image
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80";

// Default property images
const DEFAULT_IMAGES = {
  apartment: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
  penthouse: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
  house: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
  plot: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop"
};

// WhatsApp number for contact
const WHATSAPP_NUMBER = "919738634402";

// API Base URL for health check
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blr-estate-api.onrender.com/api';

const A1BuildersRealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('buy');
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  // New state variables for added features
  const [showBrochureGenerator, setShowBrochureGenerator] = useState(false);
  const [selectedPropertyForBrochure, setSelectedPropertyForBrochure] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log('🔍 Checking backend connection...');
        const response = await fetch(`${API_BASE_URL}/health`).catch(() => null);
        
        if (response && response.ok) {
          setBackendStatus('connected');
          console.log('✅ Backend is connected');
        } else {
          setBackendStatus('disconnected');
          console.warn('❌ Backend check failed');
        }
      } catch (err) {
        setBackendStatus('disconnected');
        console.error('Backend check error:', err);
      } finally {
        setConnectionChecked(true);
      }
    };
    
    if (!connectionChecked) {
      checkBackend();
    }
  }, [connectionChecked]);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserName(user.name);
      setUserRole(user.role);
    }
  }, []);

  // Fetch properties from backend
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📦 Fetching properties...');
      
      const response = await propertyAPI.getAll();
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Found ${response.data.length} properties`);
        setProperties(response.data);
        setFilteredProperties(response.data);
        if (backendStatus === 'disconnected' && connectionChecked) {
          setBackendStatus('connected');
        }
      } else {
        console.error('❌ Invalid response format');
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      
      let errorMsg = 'Failed to load properties. ';
      
      if (error.message === 'Network Error') {
        errorMsg += 'Backend server may not be running.';
        setBackendStatus('disconnected');
      } else if (error.response) {
        errorMsg += `Server error: ${error.response.status}`;
      } else {
        errorMsg += error.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [backendStatus, connectionChecked]);

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filter properties
  useEffect(() => {
    if (!properties.length) return;
    
    let filtered = [...properties];

    if (activeTab === 'rent') {
      filtered = filtered.filter(p => p.listingType === 'rent');
    } else {
      filtered = filtered.filter(p => p.listingType !== 'rent');
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.price || 0;
        return price >= min && (max ? price <= max : true);
      });
    }

    if (propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    if (bedrooms !== 'all') {
      filtered = filtered.filter(p => p.bedrooms === parseInt(bedrooms));
    }

    setFilteredProperties(filtered);
  }, [priceRange, propertyType, bedrooms, properties, activeTab]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const viewPropertyDetails = (property) => {
    console.log('Viewing property details:', property);
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setCurrentPage('property-detail');
  };

  const refreshProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propertyAPI.getAll();
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Refreshed: Found ${response.data.length} properties`);
        setProperties(response.data);
        setFilteredProperties(response.data);
        setBackendStatus('connected');
      } else {
        setError('No properties found.');
      }
    } catch (error) {
      setError('Failed to refresh: ' + error.message);
      setBackendStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const clearFilters = () => {
    setPriceRange('all');
    setPropertyType('all');
    setBedrooms('all');
  };

  const handleDeleteProperty = async (propertyId, propertyTitle) => {
    setPropertyToDelete({ id: propertyId, title: propertyTitle });
    setShowDeleteModal(true);
  };

  const confirmDeleteProperty = async () => {
    if (propertyToDelete) {
      try {
        await propertyAPI.delete(propertyToDelete.id);
        setSuccessMessage('✅ Property deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        await refreshProperties();
        if (currentPage === 'property-detail') {
          setCurrentPage('home');
        }
      } catch (error) {
        setErrorMessage('Failed to delete property: ' + error.message);
        setTimeout(() => setErrorMessage(null), 3000);
      } finally {
        setShowDeleteModal(false);
        setPropertyToDelete(null);
      }
    }
  };

  const handleUpdateProperty = async (propertyId, updatedData) => {
    try {
      await propertyAPI.update(propertyId, updatedData);
      setSuccessMessage('✅ Property updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await refreshProperties();
      setIsEditing(false);
      setCurrentPage('home');
    } catch (error) {
      setErrorMessage('Failed to update property: ' + error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // Get property image with fallback
  const getPropertyImage = (property) => {
    if (property.images && property.images.length > 0 && property.images[0]) {
      return property.images[0];
    }
    if (property.image && property.image.startsWith('http')) {
      return property.image;
    }
    switch (property.type) {
      case 'Villa':
        return DEFAULT_IMAGES.villa;
      case 'Penthouse':
        return DEFAULT_IMAGES.penthouse;
      case 'Independent House':
        return DEFAULT_IMAGES.house;
      case 'Plot':
        return DEFAULT_IMAGES.plot;
      default:
        return DEFAULT_IMAGES.apartment;
    }
  };

  // WhatsApp contact function
  const openWhatsApp = () => {
    const message = "Hello! I'm interested in your property listing on A1 Builders.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Fullscreen Image Modal
  const FullscreenImageModal = ({ image, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={image}
          alt="Fullscreen view"
          className="max-w-[95vw] max-h-[95vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  // Property Detail Page
  const PropertyDetailPage = ({ property }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState(property);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const allImages = property.images && property.images.length > 0 
      ? property.images 
      : [getPropertyImage(property)];
    
    const nextImage = () => {
      setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
    };
    
    const prevImage = () => {
      setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const openFullscreen = () => {
      setIsFullscreen(true);
    };

    const amenities = [
      { icon: Wifi, label: 'High-Speed WiFi' },
      { icon: Car, label: 'Covered Parking' },
      { icon: Dumbbell, label: 'Fitness Center' },
      { icon: TreePine, label: 'Garden & Park' },
      { icon: ShieldCheck, label: '24/7 Security' },
      { icon: Camera, label: 'CCTV Surveillance' },
    ];

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.location + ', Bangalore')}`;

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      await handleUpdateProperty(property._id, editFormData);
    };

    if (isEditMode && userRole === 'owner') {
      return (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] px-8 py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Edit Property</h2>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({...editFormData, price: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={editFormData.type}
                      onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>
                  
                  {editFormData.type !== 'Plot' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                        <input
                          type="number"
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                          value={editFormData.bedrooms}
                          onChange={(e) => setEditFormData({...editFormData, bedrooms: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                        <input
                          type="number"
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                          value={editFormData.bathrooms}
                          onChange={(e) => setEditFormData({...editFormData, bathrooms: parseInt(e.target.value)})}
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqft)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={editFormData.area}
                      onChange={(e) => setEditFormData({...editFormData, area: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={editFormData.listingType}
                      onChange={(e) => setEditFormData({...editFormData, listingType: e.target.value})}
                    >
                      <option value="buy">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {isFullscreen && (
          <FullscreenImageModal 
            image={allImages[currentImgIndex]} 
            onClose={() => setIsFullscreen(false)} 
          />
        )}

        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 text-gray-600 hover:text-[#1a1a2e] transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Properties</span>
              </button>
              <div className="flex gap-3">
                {userRole === 'owner' && (
                  <>
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white hover:shadow-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProperty(property._id, property.title)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setSuccessMessage('Link copied to clipboard!');
                    setTimeout(() => setSuccessMessage(null), 3000);
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={() => toggleFavorite(property._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Heart className={`w-4 h-4 transition-all ${favorites.includes(property._id) ? 'fill-red-500 text-red-500' : ''}`} />
                  Save
                </button>
                {userRole === 'owner' && (
                  <button 
                    onClick={() => {
                      setSelectedPropertyForBrochure(property);
                      setShowBrochureGenerator(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Brochure
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100 h-[500px]">
              <img
                src={allImages[currentImgIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGES.apartment;
                }}
              />
              <button
                onClick={openFullscreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
              >
                <Maximize className="w-5 h-5" />
              </button>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImgIndex(idx)}
                        className={`transition-all rounded-full ${
                          idx === currentImgIndex ? 'bg-white w-3 h-3' : 'bg-white/50 w-2 h-2'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-5 h-5 mr-2 text-[#d4af37]" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  {property.featured && (
                    <span className="bg-[#d4af37] text-[#1a1a2e] px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#1a1a2e]">
                      {formatPrice(property.price)}
                    </div>
                    {property.listingType === 'rent' && (
                      <div className="text-sm text-gray-500 mt-1">per month</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Verified Property</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {property.type !== 'Plot' ? (
                  <>
                    <div className="text-center">
                      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Bed className="w-6 h-6 text-[#1a1a2e]" />
                      </div>
                      <div className="text-xl font-bold text-[#1a1a2e]">{property.bedrooms}</div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Bath className="w-6 h-6 text-[#1a1a2e]" />
                      </div>
                      <div className="text-xl font-bold text-[#1a1a2e]">{property.bathrooms}</div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-center">
                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-[#1a1a2e]" />
                    </div>
                    <div className="text-xl font-bold text-[#1a1a2e]">{property.area}</div>
                    <div className="text-sm text-gray-500">Plot Size (sqft)</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Square className="w-6 h-6 text-[#1a1a2e]" />
                  </div>
                  <div className="text-xl font-bold text-[#1a1a2e]">{property.area}</div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-[#1a1a2e]" />
                  </div>
                  <div className="text-xl font-bold text-[#1a1a2e]">2022</div>
                  <div className="text-sm text-gray-500">Built Year</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description || 'Beautiful property in a prime location with modern amenities and excellent connectivity. Perfect for families looking for comfort and convenience.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <amenity.icon className="w-5 h-5 text-[#d4af37]" />
                      <span className="text-gray-700 text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-[#d4af37]" />
                  Location Map
                </h2>
                <div className="rounded-xl overflow-hidden h-96">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl}
                    allowFullScreen
                    title="Property Location"
                  ></iframe>
                </div>
                <p className="text-gray-600 mt-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  {property.location}
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-4">Schedule a Visit</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSuccessMessage('✅ Visit scheduled successfully! Our team will contact you soon.'); setTimeout(() => setSuccessMessage(null), 3000); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder="+91 "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Schedule Visit
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={openWhatsApp}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Agent on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sell Property Page
  const SellPropertyPage = () => {
    const [formData, setFormData] = useState({
      title: '',
      location: '',
      price: '',
      type: 'Apartment',
      bedrooms: '',
      bathrooms: '',
      area: '',
      description: '',
      listingType: 'buy'
    });
    
    const [plotSize, setPlotSize] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [amenities, setAmenities] = useState([
      { name: 'High-Speed WiFi', icon: 'Wifi', selected: true },
      { name: 'Covered Parking', icon: 'Car', selected: true },
      { name: 'Fitness Center', icon: 'Dumbbell', selected: false },
      { name: 'Garden & Park', icon: 'TreePine', selected: false },
      { name: '24/7 Security', icon: 'ShieldCheck', selected: true },
      { name: 'CCTV Surveillance', icon: 'Camera', selected: false },
      { name: 'Swimming Pool', icon: 'Droplet', selected: false },
      { name: 'Club House', icon: 'Building', selected: false },
      { name: 'Children\'s Play Area', icon: 'Users', selected: false },
      { name: 'Power Backup', icon: 'Zap', selected: true }
    ]);

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    };

    const removeImage = (index) => {
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setUploading(true);
      
      try {
        let imageUrl = DEFAULT_IMAGES.apartment;
        
        if (imagePreviews.length > 0) {
          imageUrl = imagePreviews[0];
        }

        const selectedAmenities = amenities.filter(a => a.selected).map(a => ({ name: a.name, icon: a.icon }));

        const propertyData = {
          title: formData.title,
          location: formData.location,
          price: parseInt(formData.price),
          type: formData.type,
          bedrooms: formData.type !== 'Plot' ? parseInt(formData.bedrooms) : 0,
          bathrooms: formData.type !== 'Plot' ? parseInt(formData.bathrooms) : 0,
          area: parseInt(formData.area),
          description: formData.description,
          listingType: formData.listingType,
          featured: false,
          image: imageUrl,
          images: imagePreviews,
          amenities: selectedAmenities,
          plotSize: formData.type === 'Plot' ? parseInt(plotSize) : null
        };

        console.log('Submitting property:', propertyData);
        
        const response = await propertyAPI.create(propertyData);
        
        console.log('Property created:', response.data);
        setSuccessMessage('✅ Property listed successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        
        setFormData({
          title: '',
          location: '',
          price: '',
          type: 'Apartment',
          bedrooms: '',
          bathrooms: '',
          area: '',
          description: '',
          listingType: 'buy'
        });
        setPlotSize('');
        setImagePreviews([]);
        setAmenities(amenities.map(a => ({ ...a, selected: a.name === 'High-Speed WiFi' || a.name === 'Covered Parking' || a.name === '24/7 Security' })));
        
        await refreshProperties();
        setCurrentPage('home');
      } catch (error) {
        console.error('Error listing property:', error);
        setErrorMessage('Error listing property: ' + (error.response?.data?.message || error.message));
        setTimeout(() => setErrorMessage(null), 3000);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a1a2e] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] px-8 py-6 text-center">
              <div className="inline-block p-3 bg-[#d4af37] rounded-full mb-4">
                <Upload className="w-8 h-8 text-[#1a1a2e]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">List Your Property</h1>
              <p className="text-gray-300 text-sm">Fill in the details to list your property on A1 Builders</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Property Photos</h3>
                <p className="text-sm text-gray-500 mb-3">Upload living room, bedroom, kitchen, bathroom, and exterior photos</p>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#d4af37] transition-all">
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-28 object-cover rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="cursor-pointer inline-block bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm">
                        <span>Add More Photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Upload high-quality photos of your property</p>
                      <p className="text-xs text-gray-400 mb-4">Living Room, Bedroom, Kitchen, Bathroom, Exterior</p>
                      <label className="cursor-pointer inline-block bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all text-sm">
                        <span>Choose Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder="e.g., Luxury 3BHK Villa in Whitefield"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder="e.g., Whitefield, Bangalore"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder="e.g., 12500000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
                    <select
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={formData.listingType}
                      onChange={(e) => setFormData({...formData, listingType: e.target.value})}
                    >
                      <option value="buy">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                    <select
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Plot">Plot / Land</option>
                    </select>
                  </div>

                  {formData.type !== 'Plot' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                          placeholder="e.g., 3"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                          placeholder="e.g., 3"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft) *</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                      placeholder={formData.type === 'Plot' ? "e.g., 2400 (Plot Size)" : "e.g., 1800"}
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Property Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <label key={index} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                      <input
                        type="checkbox"
                        checked={amenity.selected}
                        onChange={(e) => {
                          const newAmenities = [...amenities];
                          newAmenities[index].selected = e.target.checked;
                          setAmenities(newAmenities);
                        }}
                        className="rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37]"
                      />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Property Description</h3>
                <textarea
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="Describe your property in detail. Include features, amenities, nearby facilities, and unique selling points..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Listing Property...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    List Property Now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Login Page
  const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      phone: ''
    });
    const [formError, setFormError] = useState('');
    const loginCardRef = useRef(null);

    useEffect(() => {
      gsap.fromTo(loginCardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)"
        }
      );
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');
      
      try {
        if (isLogin) {
          const response = await authAPI.login({
            email: formData.email,
            password: formData.password
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsLoggedIn(true);
          setUserName(response.data.user.name);
          setUserRole(response.data.user.role);
          setCurrentPage('home');
        } else {
          const response = await authAPI.register(formData);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsLoggedIn(true);
          setUserName(response.data.user.name);
          setUserRole(response.data.user.role);
          setCurrentPage('home');
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
        setFormError(errorMsg);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2d2d4e] to-[#1a1a2e] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4af37]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#d4af37]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#d4af37]/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 5}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div ref={loginCardRef} className="relative z-10 w-full max-w-5xl">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 bg-white">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Building2 className="w-10 h-10 text-[#d4af37]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                    {isLogin ? 'Welcome Back!' : 'Join A1 Builders'}
                  </h2>
                  <p className="text-gray-500">
                    {isLogin ? 'Sign in to your account' : 'Create your account to browse properties'}
                  </p>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <>
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                          <input
                            type="tel"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                      <input
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                      <input
                        type="password"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2d2d4e] to-[#1a1a2e] transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-gray-600 hover:text-[#d4af37] font-medium transition-all duration-300 hover:underline"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>

                {isLogin && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-500 mb-3">Demo Owner Login:</p>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm">
                      <p className="flex items-center gap-2"><MailIcon className="w-4 h-4 text-[#d4af37]" /> Imrankhan@gmail.com</p>
                      <p className="flex items-center gap-2 mt-1"><Key className="w-4 h-4 text-[#d4af37]" /> ImranKhan786#</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:w-1/2 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4e] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37]/10 rounded-full -ml-32 -mb-32"></div>
                
                <div className="relative z-10 text-center text-white">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-12">
                      <Crown className="w-10 h-10 text-[#d4af37]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Why Join A1 Builders?</h3>
                  <ul className="space-y-4 text-left">
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
                      <span>Access exclusive property listings</span>
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
                      <span>Save favorite properties</span>
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
                      <span>Get personalized recommendations</span>
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
                      <span>Direct contact with builders</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex justify-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#d4af37]">15+</div>
                        <div className="text-xs text-gray-400">Years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#d4af37]">50K+</div>
                        <div className="text-xs text-gray-400">Clients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#d4af37]">100%</div>
                        <div className="text-xs text-gray-400">Verified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // About Page with GSAP animations
  const AboutPage = () => {
    const stats = [
      { icon: Home, value: properties.length || 0, label: 'Premium Properties', suffix: '+' },
      { icon: UsersIcon, value: '50,000', label: 'Happy Clients', suffix: '+' },
      { icon: AwardIcon, value: '15', label: 'Years Experience', suffix: '+' },
      { icon: Shield, value: '100', label: 'Verified Properties', suffix: '%' }
    ];

    const values = [
      { icon: HeartHandshake, title: 'Trust & Transparency', desc: 'We believe in complete transparency in every transaction, building trust that lasts a lifetime.', color: 'from-rose-500 to-pink-500' },
      { icon: Target, title: 'Customer First', desc: 'Our customers are at the heart of everything we do. Their satisfaction is our success.', color: 'from-blue-500 to-cyan-500' },
      { icon: Zap, title: 'Innovation', desc: 'Leveraging cutting-edge technology to provide seamless property discovery experience.', color: 'from-amber-500 to-orange-500' },
      { icon: Shield, title: 'Quality Assurance', desc: 'Every property listed undergoes rigorous verification to ensure quality and authenticity.', color: 'from-emerald-500 to-teal-500' }
    ];

    const milestones = [
      { year: '2010', title: 'The Beginning', desc: 'A1 Builders was founded with a vision to transform real estate in Bangalore.', icon: Rocket },
      { year: '2013', title: 'First Milestone', desc: 'Helped 1000+ families find their dream homes across Bangalore.', icon: AwardIcon },
      { year: '2016', title: 'Digital Transformation', desc: 'Launched our online platform for seamless property discovery.', icon: Globe },
      { year: '2019', title: 'Expansion', desc: 'Expanded to cover all prime locations in Bangalore metropolitan area.', icon: TrendingUp },
      { year: '2022', title: '50K+ Happy Clients', desc: 'Reached the milestone of serving over 50,000 satisfied customers.', icon: UsersIcon },
      { year: '2024', title: 'The Future', desc: 'Continuing to innovate and provide the best real estate experience.', icon: Sparkles }
    ];

    // Refs for GSAP animations
    const heroRef = useRef(null);
    const statsGridRef = useRef(null);
    const missionRef = useRef(null);
    const valuesRef = useRef(null);
    const journeyRef = useRef(null);
    const teamRef = useRef(null);
    const ctaRef = useRef(null);
    const statCardsRef = useRef([]);
    const valueCardsRef = useRef([]);
    const teamCardsRef = useRef([]);
    const milestoneItemsRef = useRef([]);

    useEffect(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stats cards animation
      gsap.fromTo(statCardsRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: statsGridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Mission and Vision cards
      gsap.fromTo(missionRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Values cards animation
      gsap.fromTo(valueCardsRef.current,
        { opacity: 0, scale: 0.6, rotationY: 90 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Journey timeline animation
      gsap.fromTo(milestoneItemsRef.current,
        { opacity: 0, x: (i) => i % 2 === 0 ? -60 : 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Team cards animation
      gsap.fromTo(teamCardsRef.current,
        { opacity: 0, scale: 0.7, rotation: 10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(0.8)",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // CTA section animation
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Continuous floating animation for icons
      gsap.to(".float-icon", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2
      });

      // Hover animation for stat cards
      statCardsRef.current.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.in"
          });
        });
      });

    }, []);

    const teamMembers = [
      { name: 'Imran Khan', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/men/1.jpg', bio: '15+ years in real estate industry', whatsapp: '919738634402' },
      { name: 'Priya Sharma', role: 'Head of Sales', image: 'https://randomuser.me/api/portraits/women/2.jpg', bio: 'Expert in luxury properties', whatsapp: '919738634402' },
      { name: 'Rahul Mehta', role: 'Operations Director', image: 'https://randomuser.me/api/portraits/men/3.jpg', bio: 'Ensuring smooth transactions', whatsapp: '919738634402' },
      { name: 'Anjali Nair', role: 'Customer Success', image: 'https://randomuser.me/api/portraits/women/4.jpg', bio: 'Making clients happy', whatsapp: '919738634402' }
    ];

    const testimonials = [
      { name: 'Rahul Mehta', role: 'Homeowner', content: 'A1 Builders helped me find my dream home in Whitefield. The experience was seamless and professional.', rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Priya Sharma', role: 'Investor', content: 'Excellent platform for property investment. Got great returns on my investment within a year.', rating: 5, image: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { name: 'Amit Kumar', role: 'First-time Buyer', content: 'The team was very supportive throughout the buying process. Highly recommended!', rating: 5, image: 'https://randomuser.me/api/portraits/men/3.jpg' }
    ];

    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a1a2e] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div ref={heroRef} className="text-center mb-20">
            <div className="inline-block p-4 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Building2 className="w-12 h-12 text-[#d4af37]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] mb-6">
              About <span className="bg-gradient-to-r from-[#1a1a2e] to-[#d4af37] bg-clip-text text-transparent">A1 Builders</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              Bangalore's premier real estate platform connecting dreams with reality through technology, 
              transparency, and trusted partnerships since 2010.
            </p>
          </div>

          {/* Stats Section */}
          <div ref={statsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                ref={el => statCardsRef.current[index] = el}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 cursor-pointer"
              >
                <div className="float-icon bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="text-3xl font-bold text-[#1a1a2e]">
                  {stat.value}{stat.suffix}
                </h3>
                <p className="text-gray-500 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mission and Vision */}
          <div ref={missionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-8 text-white transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <Target className="w-7 h-7 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To revolutionize property discovery in Bangalore by providing a seamless, transparent, 
                  and comprehensive platform that connects dream homes with happy families.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-8 text-white transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform duration-300">
                  <Globe className="w-7 h-7 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To become India's most trusted real estate ecosystem, recognized for innovation, 
                  integrity, and exceptional customer service.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div ref={valuesRef} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">Our Core Values</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  ref={el => valueCardsRef.current[index] = el}
                  className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Timeline */}
          <div ref={journeyRef} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">Our Journey</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">15+ years of excellence in real estate</p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#1a1a2e] to-[#d4af37] hidden md:block"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    ref={el => milestoneItemsRef.current[index] = el}
                    className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="md:w-1/2 p-4">
                      <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-xl flex items-center justify-center shadow-md">
                            <milestone.icon className="w-6 h-6 text-[#d4af37]" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#d4af37]">{milestone.year}</span>
                            <h3 className="text-xl font-bold text-[#1a1a2e]">{milestone.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed">{milestone.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:block w-8 h-8 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-full border-4 border-white shadow-md z-10"></div>
                    <div className="md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div ref={teamRef} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">Meet Our Leadership</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">The passionate team behind A1 Builders</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  ref={el => teamCardsRef.current[index] = el}
                  className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 hover:border-[#d4af37] transition-all duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e]">{member.name}</h3>
                  <p className="text-[#d4af37] text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs">{member.bio}</p>
                  <button
                    onClick={() => window.open(`https://wa.me/${member.whatsapp}?text=${encodeURIComponent("Hello! I'm interested in your services at A1 Builders.")}`, '_blank')}
                    className="mt-3 inline-flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-all"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Contact on WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">What Our Clients Say</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Real stories from our happy customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <Quote className="w-8 h-8 text-[#d4af37] mb-4 opacity-50" />
                  <p className="text-gray-600 mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-[#1a1a2e]">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                    <div className="flex ml-auto gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#d4af37] text-[#d4af37]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div ref={ctaRef} className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-12 text-center transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37]/10 rounded-full -ml-32 -mb-32"></div>
            <div className="relative z-10">
              <Crown className="w-16 h-16 text-[#d4af37] mx-auto mb-4 animate-float" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of happy homeowners who found their perfect property with A1 Builders
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-white text-[#1a1a2e] px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Browse Properties
                </button>
                <button
                  onClick={openWhatsApp}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Us on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Home Page
  const HomePage = () => {
    const heroTitleRef = useRef(null);
    const heroSubtitleRef = useRef(null);
    const heroButtonRef = useRef(null);

    useEffect(() => {
      gsap.fromTo(heroTitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(heroSubtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
      );
      gsap.fromTo(heroButtonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: "back.out(1.2)" }
      );
    }, []);

    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => setCurrentPage('home')}
              >
                <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] p-2 rounded-lg transform group-hover:scale-105 transition-transform">
                  <Building2 className="text-[#d4af37] w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#1a1a2e]">A1 Builders</h1>
                  <p className="text-xs text-gray-500">Premium Properties</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={() => setActiveTab('buy')} 
                  className={`transition-all text-sm font-medium ${
                    activeTab === 'buy' 
                      ? 'text-[#1a1a2e] border-b-2 border-[#d4af37]' 
                      : 'text-gray-600 hover:text-[#1a1a2e]'
                  }`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setActiveTab('rent')} 
                  className={`transition-all text-sm font-medium ${
                    activeTab === 'rent' 
                      ? 'text-[#1a1a2e] border-b-2 border-[#d4af37]' 
                      : 'text-gray-600 hover:text-[#1a1a2e]'
                  }`}
                >
                  Rent
                </button>
                <button 
                  onClick={() => setCurrentPage('portfolio')}
                  className="text-gray-600 hover:text-[#1a1a2e] transition-all text-sm font-medium flex items-center gap-1"
                >
                  <BriefcaseIcon className="w-4 h-4" />
                  Portfolio
                </button>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className="text-gray-600 hover:text-[#1a1a2e] transition-all text-sm font-medium"
                >
                  About
                </button>
                
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    {userRole === 'owner' && (
                      <button 
                        onClick={() => setCurrentPage('sell')} 
                        className="text-gray-600 hover:text-[#1a1a2e] transition-all text-sm font-medium"
                      >
                        Sell Property
                      </button>
                    )}
                    <span className="text-gray-700 text-sm">Hi, {userName}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-4 py-1.5 rounded-lg text-sm hover:shadow-lg transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                  >
                    Login / Sign Up
                  </button>
                )}
              </nav>

              <button 
                className="md:hidden text-gray-900" 
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="md:hidden bg-white border-t border-gray-100">
              <nav className="flex flex-col space-y-3 px-4 py-5">
                <button onClick={() => { setActiveTab('buy'); setMobileMenu(false); }} className="text-gray-600 hover:text-[#1a1a2e] text-left py-1">
                  Buy
                </button>
                <button onClick={() => { setActiveTab('rent'); setMobileMenu(false); }} className="text-gray-600 hover:text-[#1a1a2e] text-left py-1">
                  Rent
                </button>
                <button onClick={() => { setCurrentPage('portfolio'); setMobileMenu(false); }} className="text-gray-600 hover:text-[#1a1a2e] text-left py-1">
                  Portfolio
                </button>
                <button onClick={() => { setCurrentPage('about'); setMobileMenu(false); }} className="text-gray-600 hover:text-[#1a1a2e] text-left py-1">
                  About
                </button>
                {isLoggedIn ? (
                  <>
                    {userRole === 'owner' && (
                      <button onClick={() => { setCurrentPage('sell'); setMobileMenu(false); }} className="text-gray-600 hover:text-[#1a1a2e] text-left py-1">
                        Sell Property
                      </button>
                    )}
                    <span className="text-gray-700 text-sm">Hi, {userName}</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenu(false);
                      }}
                      className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-4 py-1.5 rounded-lg text-left text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentPage('login');
                      setMobileMenu(false);
                    }}
                    className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-4 py-1.5 rounded-lg text-left text-sm"
                  >
                    Login / Sign Up
                  </button>
                )}
              </nav>
            </div>
          )}
        </header>

        <section className="relative h-[550px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${BACKGROUND_IMAGE})`,
              filter: 'blur(8px)',
              transform: 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
            <div className="max-w-3xl">
              <h2 ref={heroTitleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Find Your <span className="text-[#d4af37]">Dream Home</span><br />
                in Bangalore
              </h2>
              <p ref={heroSubtitleRef} className="text-lg md:text-xl text-gray-200 mb-8">
                Discover premium properties in the Silicon Valley of India with A1 Builders
              </p>

              <div ref={heroButtonRef} className="bg-white rounded-xl shadow-xl">
                <div className="flex flex-col md:flex-row">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 flex items-center justify-center gap-2 hover:bg-gray-200 transition-all rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                  >
                    <Filter className="w-5 h-5" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                  {(priceRange !== 'all' || propertyType !== 'all' || bedrooms !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="bg-red-500 text-white px-6 py-4 flex items-center justify-center gap-2 hover:bg-red-600 transition-all rounded-b-xl md:rounded-r-xl"
                    >
                      <X className="w-5 h-5" />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 bg-white rounded-xl shadow-xl p-5 animate-scaleIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                      >
                        <option value="all">All Prices</option>
                        <option value="0-10000000">Under ₹1 Cr</option>
                        <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                        <option value="20000000-50000000">₹2 Cr - ₹5 Cr</option>
                        <option value="50000000-999999999">Above ₹5 Cr</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Plot">Plot / Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                      >
                        <option value="all">Any</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-fadeInUp">
                <div className="text-2xl font-bold text-[#1a1a2e]">{properties.length}+</div>
                <div className="text-sm text-gray-500 mt-1">Premium Properties</div>
              </div>
              <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl font-bold text-[#1a1a2e]">50,000+</div>
                <div className="text-sm text-gray-500 mt-1">Happy Clients</div>
              </div>
              <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl font-bold text-[#1a1a2e]">15+</div>
                <div className="text-sm text-gray-500 mt-1">Years Experience</div>
              </div>
              <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl font-bold text-[#1a1a2e]">100%</div>
                <div className="text-sm text-gray-500 mt-1">Verified Properties</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1a1a2e]">
                  {activeTab === 'buy' ? 'Properties for Sale' : 'Properties for Rent'}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredProperties.length} properties found
                </p>
              </div>
              <button
                onClick={refreshProperties}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-[#d4af37]"></div>
                <p className="mt-4 text-gray-500">Loading properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-50 rounded-2xl p-8 inline-block">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-lg text-gray-700 mb-1">No properties found</p>
                  <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
                  <button 
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-5 py-2 rounded-lg text-sm hover:shadow-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <div 
                    key={property._id} 
                    className="property-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="relative overflow-hidden bg-gray-100 h-56">
                      <img 
                        src={getPropertyImage(property)} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGES.apartment;
                        }}
                      />
                      
                      {property.featured && (
                        <div className="absolute top-3 left-3 bg-[#d4af37] text-[#1a1a2e] px-2 py-0.5 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                      
                      {property.listingType === 'rent' && (
                        <div className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          For Rent
                        </div>
                      )}
                      
                      {isLoggedIn && userRole === 'owner' && (
                        <>
                          <div className="absolute bottom-3 right-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewPropertyDetails(property);
                                setIsEditing(true);
                              }}
                              className="bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-all shadow-sm"
                              title="Edit Property"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProperty(property._id, property.title);
                              }}
                              className="bg-white text-red-600 p-1.5 rounded-full hover:bg-gray-100 transition-all shadow-sm"
                              title="Delete Property"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPropertyForBrochure(property);
                              setShowBrochureGenerator(true);
                            }}
                            className="absolute bottom-3 left-3 bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-all shadow-sm"
                            title="Generate Brochure"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => toggleFavorite(property._id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-all shadow-sm"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-all ${favorites.includes(property._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        />
                      </button>
                      
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <span className="text-sm font-bold text-[#1a1a2e]">{formatPrice(property.price)}</span>
                        {property.listingType === 'rent' && <span className="text-xs text-gray-500">/mo</span>}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-[#1a1a2e] mb-1 line-clamp-1">
                        {property.title}
                      </h4>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#d4af37]" />
                        <span className="text-xs">{property.location}</span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        {property.type !== 'Plot' ? (
                          <>
                            <div className="flex items-center text-gray-600 gap-2">
                              <Bed className="w-3.5 h-3.5" />
                              <span className="text-xs">{property.bedrooms} Beds</span>
                            </div>
                            <div className="flex items-center text-gray-600 gap-2">
                              <Bath className="w-3.5 h-3.5" />
                              <span className="text-xs">{property.bathrooms} Baths</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center text-gray-600 gap-2 col-span-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-xs">Plot / Land</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600 gap-2">
                          <Square className="w-3.5 h-3.5" />
                          <span className="text-xs">{property.area} sqft</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => viewPropertyDetails(property)}
                        className="w-full mt-4 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-[#d4af37] p-2 rounded-lg">
                    <Building2 className="text-[#1a1a2e] w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold text-white">A1 Builders</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Your trusted partner in finding premium properties across Bangalore. 
                  Making dream homes a reality since 2010.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all duration-300">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all duration-300">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all duration-300">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all duration-300">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Browse Properties</button></li>
                  <li><button onClick={() => setCurrentPage('portfolio')} className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Agent Portfolio</button></li>
                  <li><button onClick={() => setCurrentPage('about')} className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About Us</button></li>
                  {userRole === 'owner' && (
                    <li><button onClick={() => setCurrentPage('sell')} className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> List Property</button></li>
                  )}
                  <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-lg">Contact Info</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 mt-0.5 text-[#d4af37]" />
                    <span>Bangalore, Karnataka, India - 560001</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <PhoneIcon className="w-4 h-4 text-[#d4af37]" />
                    <span>+91 97386 34402</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MailIcon className="w-4 h-4 text-[#d4af37]" />
                    <span>info@a1builders.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#d4af37]" />
                    <span>www.a1builders.com</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-lg">Business Hours</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-3">
                    <ClockIcon className="w-4 h-4 text-[#d4af37]" />
                    <div>
                      <div>Monday - Friday: 9AM - 8PM</div>
                      <div className="text-xs text-gray-500">(All days open)</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-[#d4af37]" />
                    <div>
                      <div>Saturday: 10AM - 6PM</div>
                      <div className="text-xs text-gray-500">(Limited support)</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Coffee className="w-4 h-4 text-[#d4af37]" />
                    <div>
                      <div>Sunday: By Appointment</div>
                      <div className="text-xs text-gray-500">(Prior booking required)</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 A1 Builders. All rights reserved. | Built with ❤️ in Bangalore
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Subscribe to newsletter"
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button className="bg-[#d4af37] text-[#1a1a2e] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffd700] transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Main Render
  return (
    <>
      {/* Success/Error Toasts */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slideInRight">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slideInRight">
          {errorMessage}
        </div>
      )}
      
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <FullscreenImageModal image={fullscreenImage} onClose={() => setFullscreenImage(null)} />
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProperty}
        propertyTitle={propertyToDelete?.title}
      />
      
      {/* Brochure Generator Modal */}
      {showBrochureGenerator && selectedPropertyForBrochure && (
        <BrochureGenerator
          property={selectedPropertyForBrochure}
          onClose={() => {
            setShowBrochureGenerator(false);
            setSelectedPropertyForBrochure(null);
          }}
          onGenerate={() => {
            setSuccessMessage('✅ Brochure generated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
          }}
        />
      )}
      
      {/* Page Rendering */}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'portfolio' && (
        <PortfolioPage 
          isOwner={userRole === 'owner'} 
          userRole={userRole}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'property-detail' && selectedProperty && <PropertyDetailPage property={selectedProperty} />}
      {userRole === 'owner' && currentPage === 'sell' && <SellPropertyPage />}
      {currentPage === 'about' && <AboutPage />}
    </>
  );
};

export default A1BuildersRealEstate;
