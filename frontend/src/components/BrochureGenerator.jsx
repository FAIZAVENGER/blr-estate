import React, { useState } from 'react';
import { Download, FileText, MapPin, X, Phone } from 'lucide-react';

const BrochureGenerator = ({ property, onClose, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatPrice = (price) => {
    if (!price) return '₹0';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const brochureContent = document.createElement('div');
      brochureContent.style.width = '800px';
      brochureContent.style.backgroundColor = '#ffffff';
      brochureContent.style.padding = '40px';
      brochureContent.style.fontFamily = 'Arial, sans-serif';
      
      brochureContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 15px 30px; border-radius: 15px;">
            <h1 style="color: #ffffff; margin: 0;">🏠 A1 Builders</h1>
            <p style="color: #e2e8f0; margin: 5px 0 0 0;">Premium Properties</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <img src="${property.images?.[0] || property.image}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px;" alt="${property.title}" />
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h2 style="color: #1a202c; margin: 0 0 10px 0;">${property.title}</h2>
            <p style="color: #718096; margin: 0;">
              <span>📍 ${property.location}</span>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 28px; font-weight: bold; color: #2d3748;">${formatPrice(property.price)}</div>
            <div style="color: #48bb78; font-size: 14px;">${property.listingType === 'rent' ? 'per month' : 'one time'}</div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <div style="text-align: center;">
            <div style="font-size: 20px;">🛏️</div>
            <div style="font-weight: bold; font-size: 18px;">${property.bedrooms || 'N/A'}</div>
            <div style="color: #718096; font-size: 12px;">Bedrooms</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px;">🚿</div>
            <div style="font-weight: bold; font-size: 18px;">${property.bathrooms || 'N/A'}</div>
            <div style="color: #718096; font-size: 12px;">Bathrooms</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px;">📐</div>
            <div style="font-weight: bold; font-size: 18px;">${property.area || property.plotSize || 'N/A'}</div>
            <div style="color: #718096; font-size: 12px;">${property.type === 'Plot' ? 'Sq Ft' : 'Sq Ft'}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px;">🏗️</div>
            <div style="font-weight: bold; font-size: 18px;">${property.type}</div>
            <div style="color: #718096; font-size: 12px;">Property Type</div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1a202c; margin-bottom: 10px;">Description</h3>
          <p style="color: #4a5568; line-height: 1.6;">${property.description || 'Beautiful property in a prime location with modern amenities and excellent connectivity.'}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 10px; margin-top: 20px; color: white;">
          <h3 style="margin: 0 0 10px 0; text-align: center;">Contact Agent</h3>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>📞</span>
              <span>+91 97386 34402</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>✉️</span>
              <span>info@a1builders.com</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>💬</span>
              <span>WhatsApp: +91 97386 34402</span>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(brochureContent);
      
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${property.title.replace(/\s+/g, '_')}_Brochure.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(brochureContent).save();
      
      document.body.removeChild(brochureContent);
      
      if (onGenerate) onGenerate();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating brochure. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleWhatsAppShare = () => {
    const message = `🏠 *${property.title}*\n📍 Location: ${property.location}\n💰 Price: ${formatPrice(property.price)}\n${property.type !== 'Plot' ? `🛏️ ${property.bedrooms} Beds | 🚿 ${property.bathrooms} Baths | 📐 ${property.area} sqft` : `📐 Plot Size: ${property.plotSize || property.area} sqft`}\n\nFor more details, contact: +91 97386 34402`;
    window.open(`https://wa.me/919738634402?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Generate Property Brochure</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <div className="flex gap-4">
              <img 
                src={property.images?.[0] || property.image} 
                alt={property.title}
                className="w-24 h-24 rounded-lg object-cover"
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
                    <span>Plot Size: {property.plotSize || property.area} sqft</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-700">
              📄 Your brochure will include: Property photos, detailed specifications, amenities list, agent contact information, and A1 Builders branding.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
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
