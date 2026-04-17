const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let portfolioData = {
  name: 'Imran Khan',
  title: 'Founder & CEO | Real Estate Expert',
  bio: 'With over 15 years of experience in Bangalore\'s real estate market, I have helped more than 500 families find their dream homes. My passion is connecting people with properties that perfectly match their lifestyle and budget.',
  experience: '15+ Years',
  propertiesSold: '500+',
  rating: '4.9',
  email: 'imrankhan@a1builders.com',
  phone: '+91 97386 34402',
  location: 'Bangalore, India',
  photos: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  ],
  socialLinks: {
    instagram: 'https://instagram.com/imrankhan',
    facebook: 'https://facebook.com/imrankhan',
    twitter: 'https://twitter.com/imrankhan',
    linkedin: 'https://linkedin.com/in/imrankhan'
  }
};

router.get('/', async (req, res) => {
  try {
    res.json(portfolioData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner only.' });
    }
    portfolioData = { ...portfolioData, ...req.body };
    res.json(portfolioData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/photos', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner only.' });
    }
    const { photo } = req.body;
    portfolioData.photos.push(photo);
    res.json({ photos: portfolioData.photos });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/photos/:index', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner only.' });
    }
    const index = parseInt(req.params.index);
    if (index >= 0 && index < portfolioData.photos.length) {
      portfolioData.photos.splice(index, 1);
    }
    res.json({ photos: portfolioData.photos });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
