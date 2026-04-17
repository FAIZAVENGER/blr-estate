import React, { useState, useRef } from 'react';
import { Download, FileText, MapPin, X, Phone, Mail, Building2, Bed, Bath, Square, Wifi, Car, Dumbbell, TreePine, ShieldCheck, Camera, Droplet, Zap, Sparkles } from 'lucide-react';

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
        <title>${property.title} - Property Brochure</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #ffffff;
            padding: 40px;
          }
          
          .brochure {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          
          .header {
            background: linear-gradient(135deg, ${primaryColor}, #2d2d4e);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '✦';
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 60px;
            opacity: 0.1;
            color: ${accentColor};
          }
          
          .header::after {
            content: '✦';
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 60px;
            opacity: 0.1;
            color: ${accentColor};
          }
          
          .logo {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }
          
          .logo span {
            color: ${accentColor};
          }
          
          .tagline {
            font-size: 12px;
            opacity: 0.8;
            letter-spacing: 3px;
          }
          
          .hero-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
          }
          
          .content {
            padding: 40px;
          }
          
          .title-section {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid ${accentColor};
            padding-bottom: 20px;
          }
          
          .property-title {
            font-size: 28px;
            color: ${primaryColor};
            margin-bottom: 10px;
          }
          
          .location {
            color: #666;
            font-size: 14px;
          }
          
          .price-tag {
            background: linear-gradient(135deg, ${accentColor}, #ffd700);
            color: ${primaryColor};
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 15px;
            font-weight: bold;
            font-size: 24px;
          }
          
          .specs-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
          }
          
          .spec-card {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #f5f5f5, #ffffff);
            border-radius: 15px;
            border: 1px solid #eee;
          }
          
          .spec-icon {
            font-size: 32px;
            margin-bottom: 10px;
          }
          
          .spec-value {
            font-size: 24px;
            font-weight: bold;
            color: ${primaryColor};
          }
          
          .spec-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          
          .description {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            line-height: 1.8;
            color: #444;
          }
          
          .amenities {
            margin: 30px 0;
          }
          
          .amenities-title {
            font-size: 20px;
            color: ${primaryColor};
            margin-bottom: 20px;
            text-align: center;
          }
          
          .amenities-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          
          .amenity-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 14px;
          }
          
          .contact-section {
            background: linear-gradient(135deg, ${primaryColor}, #2d2d4e);
            color: white;
            padding: 40px;
            text-align: center;
            margin-top: 30px;
            border-radius: 15px;
          }
          
          .contact-title {
            font-size: 24px;
            margin-bottom: 20px;
            color: ${accentColor};
          }
          
          .contact-details {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .footer {
            background: ${primaryColor};
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            opacity: 0.8;
          }
          
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .brochure {
              box-shadow: none;
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
              <div class="spec-card">
                <div class="spec-icon">⭐</div>
                <div class="spec-value">Premium</div>
                <div class="spec-label">Status</div>
              </div>
            </div>
            
            <div class="description">
              <strong>✨ Property Description</strong><br/><br/>
              ${property.description || 'Experience luxury living at its finest in this exquisite property. Located in the heart of Bangalore, this home offers the perfect blend of comfort, style, and convenience. Modern amenities, prime location, and impeccable craftsmanship make this property a rare gem.'}
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
              <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">Visit our website: www.a1builders.com</p>
            </div>
          </div>
          
          <div class="footer">
            © 2024 A1 Builders | All Rights Reserved | Bangalore's Premier Real Estate Destination
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
      
      if (onGenerate) onGenerate();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating brochure. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleWhatsAppShare = () => {
    const message = `🏠 *${property.title}*\n📍 Location: ${property.location}\n💰 Price: ${formatPrice(property.price)}\n${property.type !== 'Plot' ? `🛏️ ${property.bedrooms} Beds | 🚿 ${property.bathrooms} Baths | 📐 ${property.area} sqft` : `📐 Plot Size: ${property.area} sqft`}\n\n✨ Premium amenities including WiFi, Parking, Security, and more!\n\nFor more details, contact: +91 97386 34402\n\nA1 Builders - Bangalore's Premier Real Estate Destination`;
    window.open(`https://wa.me/919738634402?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold">Generate Premium Brochure</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
            <div className="flex gap-4">
              <img 
                src={property.images?.[0] || property.image} 
                alt={property.title}
                className="w-24 h-24 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{property.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {property.location}
                </p>
                <div className="flex gap-3 mt-2 text-xs text-gray-600">
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
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template Style</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTemplate('premium')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === 'premium' 
                    ? 'border-[#d4af37] bg-[#1a1a2e] text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-[#d4af37]'
                }`}
              >
                Premium Gold
              </button>
              <button
                onClick={() => setSelectedTemplate('elegant')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === 'elegant' 
                    ? 'border-[#d4af37] bg-[#1a1a2e] text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-[#d4af37]'
                }`}
              >
                Elegant
              </button>
              <button
                onClick={() => setSelectedTemplate('modern')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === 'modern' 
                    ? 'border-[#d4af37] bg-[#1a1a2e] text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-[#d4af37]'
                }`}
              >
                Modern Blue
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <span className="text-[#d4af37] text-lg">✦</span>
              Your professional brochure will include: High-quality property photos, detailed specifications, premium amenities list, agent contact information, and A1 Builders branding with elegant design.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF Brochure
                </>
              )}
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrochureGenerator;
