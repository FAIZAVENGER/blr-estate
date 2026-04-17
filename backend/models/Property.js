const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['Apartment', 'Villa', 'Penthouse', 'Independent House', 'Plot'], 
    default: 'Apartment' 
  },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, required: true },
  image: { type: String },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  listingType: { type: String, enum: ['buy', 'rent'], default: 'buy' },
  amenities: [{
    name: { type: String },
    icon: { type: String },
    selected: { type: Boolean, default: false }
  }],
  plotSize: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
