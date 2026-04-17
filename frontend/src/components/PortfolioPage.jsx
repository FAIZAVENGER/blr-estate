import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Camera, Upload, Trash2, User, 
  Mail, Phone, MapPin, Briefcase, Award, 
  Edit2, Save, X, ImageIcon, CheckCircle, Building2,
  Instagram, Facebook, Twitter, Linkedin, Sparkles, Crown, Star
} from 'lucide-react';
import { portfolioAPI } from '../services/api';

const PortfolioPage = ({ isOwner, userRole, setCurrentPage }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

  useEffect(() => {
    loadPortfolio();
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1a1a2e] border-t-[#d4af37]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#d4af37]" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed top-20 right-4 z-50 animate-slideInRight">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1a1a2e] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
            {isOwner && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Edit2 className="w-4 h-4" />
                Edit Portfolio
              </button>
            )}
            {isOwner && isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transform hover:shadow-2xl transition-all duration-500 animate-fadeInUp">
          <div className="relative h-48 bg-gradient-to-r from-[#1a1a2e] via-[#2d2d4e] to-[#1a1a2e]">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-[#d4af37] bg-white overflow-hidden shadow-xl">
                  {photos[0] ? (
                    <img src={photos[0]} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {isOwner && isEditing && (
                  <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-[#1a1a2e] p-2 rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg">
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-[#d4af37] opacity-50" />
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="animate-fadeInLeft">
                {isEditing ? (
                  <input
                    type="text"
                    className="text-2xl font-bold text-gray-900 mb-1 border-2 border-[#d4af37] rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                ) : (
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] bg-clip-text text-transparent">{formData.name}</h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    className="text-gray-600 border-2 border-gray-200 rounded-lg px-3 py-1 w-full mt-1 focus:outline-none focus:border-[#d4af37]"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    {formData.title}
                  </p>
                )}
              </div>
              <div className="flex gap-4 animate-fadeInRight">
                <div className="text-center bg-gradient-to-br from-gray-50 to-white px-4 py-2 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-[#1a1a2e]">{formData.experience}</div>
                  <div className="text-xs text-gray-500">Experience</div>
                </div>
                <div className="text-center bg-gradient-to-br from-gray-50 to-white px-4 py-2 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-[#1a1a2e]">{formData.propertiesSold}</div>
                  <div className="text-xs text-gray-500">Properties Sold</div>
                </div>
                <div className="text-center bg-gradient-to-br from-gray-50 to-white px-4 py-2 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-[#d4af37]">⭐ {formData.rating}</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 animate-fadeInUp">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                {isEditing ? (
                  <input
                    type="email"
                    className="border rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4af37]"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                ) : (
                  <span>{formData.email}</span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                {isEditing ? (
                  <input
                    type="tel"
                    className="border rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4af37]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                ) : (
                  <span>{formData.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                {isEditing ? (
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 focus:outline-none focus:border-[#d4af37]"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                ) : (
                  <span>{formData.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transform hover:shadow-xl transition-all duration-300 animate-fadeInLeft">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#d4af37]" />
            About Me
            <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37] to-transparent ml-4"></div>
          </h2>
          {isEditing ? (
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 h-32 resize-none focus:outline-none focus:border-[#d4af37] transition-all"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">{formData.bio}</p>
          )}
        </div>

        {/* Photo Gallery Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fadeInRight">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#d4af37]" />
              Photo Gallery
              <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37] to-transparent ml-4"></div>
            </h2>
            {isOwner && isEditing && (
              <label className="flex items-center gap-2 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5">
                <Upload className="w-4 h-4" />
                Add Photos
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
            )}
          </div>
          
          {uploading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#d4af37] border-t-transparent"></div>
              <p className="text-sm text-gray-500 mt-3">Uploading photos...</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {photos.map((photo, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src={photo} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-52 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                {isOwner && isEditing && (
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">Photo {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
          
          {photos.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photos added yet</p>
              {isOwner && isEditing && (
                <label className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Your First Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-[#1a1a2e] via-[#2d2d4e] to-[#1a1a2e] rounded-2xl p-8 text-white transform hover:-translate-y-1 transition-all duration-500 animate-scaleIn">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            Achievements & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <CheckCircle className="w-8 h-8 text-[#d4af37]" />
              <div>
                <div className="font-bold">Top Agent Award</div>
                <div className="text-sm text-gray-300">2023 - Bangalore Real Estate Summit</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <CheckCircle className="w-8 h-8 text-[#d4af37]" />
              <div>
                <div className="font-bold">Customer Satisfaction</div>
                <div className="text-sm text-gray-300">98% Positive Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <CheckCircle className="w-8 h-8 text-[#d4af37]" />
              <div>
                <div className="font-bold">Highest Sales Volume</div>
                <div className="text-sm text-gray-300">2022 & 2023</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex justify-center gap-4 animate-fadeInUp">
          <a href={formData.socialLinks?.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 transform hover:scale-110">
            <Instagram className="w-4 h-4" />
          </a>
          <a href={formData.socialLinks?.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
            <Facebook className="w-4 h-4" />
          </a>
          <a href={formData.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-110">
            <Twitter className="w-4 h-4" />
          </a>
          <a href={formData.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
