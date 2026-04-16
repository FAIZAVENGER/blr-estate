const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');

dotenv.config();

const properties = [
  {
    title: 'Luxury Villa in Whitefield',
    description: 'Spacious luxury villa with modern amenities, private garden, and premium fixtures',
    location: 'Whitefield, Bangalore',
    price: 25000000,
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    featured: true,
    listingType: 'buy'
  },
  {
    title: 'Modern Apartment in Koramangala',
    location: 'Koramangala, Bangalore',
    description: 'Contemporary apartment in prime location with all amenities',
    price: 12500000,
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    featured: true,
    listingType: 'buy'
  },
  {
    title: 'Premium Penthouse in Indiranagar',
    location: 'Indiranagar, Bangalore',
    description: 'Exclusive penthouse with panoramic city views',
    price: 35000000,
    type: 'Penthouse',
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    featured: false,
    listingType: 'buy'
  },
  {
    title: 'Spacious Villa in HSR Layout',
    location: 'HSR Layout, Bangalore',
    description: 'Family-friendly villa with beautiful garden and play area',
    price: 18000000,
    type: 'Villa',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    featured: false,
    listingType: 'buy'
  },
  {
    title: 'Contemporary Flat in Electronic City',
    location: 'Electronic City, Bangalore',
    description: 'Perfect for young professionals, near tech parks',
    price: 8500000,
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    featured: true,
    listingType: 'buy'
  },
  {
    title: 'Elegant Apartment in Jayanagar',
    location: 'Jayanagar, Bangalore',
    description: 'Classic design meets modern comfort in serene locality',
    price: 15000000,
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    featured: false,
    listingType: 'buy'
  },
  {
    title: 'Luxury Duplex in Sarjapur Road',
    location: 'Sarjapur Road, Bangalore',
    description: 'Modern duplex with smart home features and premium amenities',
    price: 22000000,
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    featured: true,
    listingType: 'rent'
  },
  {
    title: 'Cozy Apartment in Bellandur',
    location: 'Bellandur, Bangalore',
    description: 'Affordable luxury near major tech parks and shopping centers',
    price: 9500000,
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    featured: false,
    listingType: 'rent'
  },
  {
    title: 'Premium Villa in Hennur',
    location: 'Hennur, Bangalore',
    description: 'Serene location with all modern amenities and green surroundings',
    price: 19500000,
    type: 'Villa',
    bedrooms: 3,
    bathrooms: 3,
    area: 2900,
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',
    featured: false,
    listingType: 'rent'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('📦 Connected to MongoDB');
    
    // Clear existing properties
    await Property.deleteMany({});
    console.log('🗑️  Cleared old properties');
    
    // Insert new properties
    await Property.insertMany(properties);
    console.log('✅ Successfully added', properties.length, 'properties!');
    
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });