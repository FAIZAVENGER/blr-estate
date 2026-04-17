import React, { useState, useRef } from 'react';
import { Download, FileText, MapPin, X, Phone, Mail, Building2, Bed, Bath, Square, Wifi, Car, Dumbbell, TreePine, ShieldCheck, Camera, Sparkles, Share2 } from 'lucide-react';

const BrochureGenerator = ({ property, onClose, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('premium');

  const formatPrice = (price) => {
    if (!price) return '₹0';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const amenitiesList = [
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: Car, label: 'Covered Parking' },
    { icon: Dumbbell, label: 'Fitness Center' },
    { icon: TreePine, label: 'Garden & Park' },
    { icon: ShieldCheck, label: '24/7 Security' },
    { icon: Camera, label: 'CCTV Surveillance' },
  ];

  const generateHTMLContent = () => {
    const primaryColor = selectedTemplate === 'premium' ? '#1a1a2e' : selectedTemplate === 'elegant' ? '#2d1810' : '#1e3a5f';
    const accentColor = '#d4af37';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
        <title>${property.title} - Property Brochure</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f5f5f5;
            padding: 16px;
          }
          
          .brochure {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          
          .header {
            background: linear-gradient(135deg, ${primaryColor}, #2d2d4e);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
          }
          
          .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .logo span {
            color: ${accentColor};
          }
          
          .tagline {
            font-size: 10px;
            opacity: 0.8;
            letter-spacing: 2px;
          }
          
          .hero-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
          }
          
          .content {
            padding: 20px;
          }
          
          .title-section {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid ${accentColor};
            padding-bottom: 15px;
          }
          
          .property-title {
            font-size: 20px;
            color: ${primaryColor};
            margin-bottom: 8px;
            font-weight: bold;
          }
          
          .location {
            color: #666;
            font-size: 12px;
          }
          
          .price-tag {
            background: linear-gradient(135deg, ${accentColor}, #ffd700);
            color: ${primaryColor};
            padding: 10px 20px;
            border-radius: 30px;
            display: inline-block;
            margin-top: 12px;
            font-weight: bold;
            font-size: 18px;
          }
          
          .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin: 20px 0;
          }
          
          .spec-card {
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, #f5f5f5, #ffffff);
            border-radius: 12px;
            border: 1px solid #eee;
          }
          
          .spec-icon {
            font-size: 24px;
            margin-bottom: 6px;
          }
          
          .spec-value {
            font-size: 18px;
            font-weight: bold;
            color: ${primaryColor};
          }
          
          .spec-label {
            font-size: 10px;
            color: #666;
            margin-top: 4px;
          }
          
          .description {
            background: #f9f9f9;
            padding: 16px;
            border-radius: 12px;
            margin: 20px 0;
            line-height: 1.5;
            color: #444;
            font-size: 13px;
          }
          
          .amenities {
            margin: 20px 0;
          }
          
          .amenities-title {
            font-size: 16px;
            color: ${primaryColor};
            margin-bottom: 12px;
            text-align: center;
          }
          
          .amenities-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .amenity-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 11px;
          }
          
          .contact-section {
            background: linear-gradient(135deg, ${primaryColor}, #2d2d4e);
            color: white;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
            border-radius: 12px;
          }
          
          .contact-title {
            font-size: 16px;
            margin-bottom: 12px;
            color: ${accentColor};
          }
          
          .contact-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
          }
          
          .footer {
            background: ${primaryColor};
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 10px;
            opacity: 0.8;
          }
          
          @media print {
            body {
              padding: 0;
              margin: 0;
              background: white;
            }
            .brochure {
              box-shadow: none;
              border-radius: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="brochure">
          <div class="header">
            <div class="logo">A1 <span>BUILDERS</span></div>
            <div class="tagline">Premium Properties | Est. 2010</div>
          </div>
          
          <img src="${property.images?.[0] || property.image}" class="hero-image" alt="${property.title}" />
          
          <div class="content">
            <div class="title-section">
              <h1 class="property-title">${property.title}</h1>
              <div class="location">📍 ${property.location}</div>
              <div class="price-tag">${formatPrice(property.price)}${property.listingType === 'rent' ? ' / month' : ''}</div>
            </div>
            
            <div class="specs-grid">
              ${property.type !== 'Plot' ? `
                <div class="spec-card">
                  <div class="spec-icon">🛏️</div>
                  <div class="spec-value">${property.bedrooms}</div>
                  <div class="spec-label">Bedrooms</div>
                </div>
                <div class="spec-card">
                  <div class="spec-icon">🚿</div>
                  <div class="spec-value">${property.bathrooms}</div>
                  <div class="spec-label">Bathrooms</div>
                </div>
              ` : `
                <div class="spec-card">
                  <div class="spec-icon">🏞️</div>
                  <div class="spec-value">${property.area}</div>
                  <div class="spec-label">Plot Area (sqft)</div>
                </div>
              `}
              <div class="spec-card">
                <div class="spec-icon">📐</div>
                <div class="spec-value">${property.area}</div>
                <div class="spec-label">Total Area (sqft)</div>
              </div>
              <div class="spec-card">
                <div class="spec-icon">🏗️</div>
                <div class="spec-value">${property.type}</div>
                <div class="spec-label">Property Type</div>
              </div>
            </div>
            
            <div class="description">
              <strong>✨ Property Description</strong><br/><br/>
              ${property.description || 'Experience luxury living at its finest in this exquisite property. Located in the heart of Bangalore, this home offers the perfect blend of comfort, style, and convenience.'}
            </div>
            
            <div class="amenities">
              <h3 class="amenities-title">✦ Premium Amenities ✦</h3>
              <div class="amenities-grid">
                ${amenitiesList.map(amenity => `
                  <div class="amenity-item">
                    <span>✓</span>
                    <span>${amenity.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="contact-section">
              <div class="contact-title">Schedule Your Private Tour</div>
              <div class="contact-details">
                <div class="contact-item">📞 +91 97386 34402</div>
                <div class="contact-item">✉️ info@a1builders.com</div>
                <div class="contact-item">💬 WhatsApp: +91 97386 34402</div>
              </div>
              <p style="margin-top: 12px; font-size: 10px; opacity: 0.8;">Visit our website: www.a1builders.com</p>
            </div>
          </div>
          
          <div class="footer">
            © 2024 A1 Builders | All Rights Reserved
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = generateHTMLContent();
      
      // For mobile devices, use a different approach
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile - open in new tab and use browser print
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        
        if (newWindow) {
          newWindow.onload = () => {
            setTimeout(() => {
              newWindow.print();
              URL.revokeObjectURL(url);
            }, 500);
          };
        } else {
          // If popup blocked, show instructions
          alert('Please allow popups to generate brochure. You can also take a screenshot of this page.');
        }
      } else {
        // For desktop - use print
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
              URL.revokeObjectURL(url);
            }, 500);
          };
        }
      }
      
      if (onGenerate) onGenerate();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating brochure. Please try again or take a screenshot.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleWhatsAppShare = () => {
    const message = `🏠 *${property.title}*\n📍 Location: ${property.location}\n💰 Price: ${formatPrice(property.price)}\n${property.type !== 'Plot' ? `🛏️ ${property.bedrooms} Beds | 🚿 ${property.bathrooms} Baths | 📐 ${property.area} sqft` : `📐 Plot Size: ${property.area} sqft`}\n\n✨ Premium amenities including WiFi, Parking, Security, and more!\n\nFor more details, contact: +91 97386 34402\n\nA1 Builders - Bangalore's Premier Real Estate Destination`;
    
    // Use WhatsApp API
    window.open(`https://wa.me/919738634402?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadImage = () => {
    // For mobile - suggest taking screenshot
    alert('On mobile devices, please use the "Share" button to share via WhatsApp, or take a screenshot of the brochure preview.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37]" />
            <h2 className="text-base sm:text-xl font-bold">Generate Brochure</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 sm:p-4 border border-gray-100">
            <div className="flex gap-3 sm:gap-4">
              <img 
                src={property.images?.[0] || property.image} 
                alt={property.title}
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{property.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> 
                  <span className="truncate">{property.location}</span>
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs text-gray-600">
                  {property.type !== 'Plot' ? (
                    <>
                      <span>{property.bedrooms} Beds</span>
                      <span>{property.bathrooms} Baths</span>
                      <span>{property.area} sqft</span>
                    </>
                  ) : (
                    <span>Plot Size: {property.area} sqft</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template Style</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedTemplate('premium')}
                className={`py-2 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${
                  selectedTemplate === 'premium' 
                    ? 'border-[#d4af37] bg-[#1a1a2e] text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-[#d4af37]'
                }`}
              >
                Premium Gold
              </button>
              <button
                onClick={() => setSelectedTemplate('elegant')}
                className={`py-2 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${
                  selectedTemplate === 'elegant' 
                    ? 'border-[#d4af37] bg-[#1a1a2e] text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-[#d4af37]'
                }`}
              >
                Elegant
              </button>
              <button
                onClick={() => setSelectedTemplate('modern')}
                className={`py-2 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${
                  selectedTemplate === 'modern' 
                    ? 'border-[#d4af37] bg-[#1a1a2e] text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-[#d4af37]'
                }`}
              >
                Modern Blue
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-blue-800">
              <span className="text-[#d4af37] text-base sm:text-lg">✦</span>
              Your brochure includes: Property photos, specifications, amenities, contact info, and A1 Builders branding.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  View & Print Brochure
                </>
              )}
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            💡 Tip: After opening the brochure, use your browser's print option to save as PDF
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrochureGenerator;
