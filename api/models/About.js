const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: { type: String, default: 'About Bajaj Associates' },
  badge: { type: String, default: 'Our Story' },
  tagline: { type: String, default: 'Premium furniture & decor trusted by 500+ happy homes' },
  story1: { type: String, default: "With over 15 years of experience, Bajaj Associates is your trusted source for premium handcrafted sofas, elegant dining sets, bespoke beds, luxury wardrobes, study desks, and contemporary home decor. We serve homeowners, interior designers, and architects across the region — delivering comfort, durability, and elegance at every budget." },
  story2: { type: String, default: "Our expert team helps you choose the perfect furniture to match your vision — whether it's a luxury home makeover or a modern office setup. Visit our showroom or browse our digital collections to explore hundreds of curated designs." },
  phone: { type: String, default: '9111999271' },
  instagramLink: { type: String, default: 'https://www.instagram.com/singhai.harshjain' },
  storeImageUrl: { type: String, default: '' },
  address: { type: String, default: '53/33 Rameshwaram Colony, Beside New Laxmi Pratisthan, Vijay Nagar Main Road, Jabalpur 482002 (M.P.)' },
  mapEmbedUrl: { type: String, default: 'https://maps.google.com/maps?q=53/33%20Rameshwaram%20Colony,%20Beside%20New%20Laxmi%20Pratisthan,%20Vijay%20Nagar%20Main%20Road,%20Jabalpur%20482002%20(M.P.)&t=&z=16&ie=UTF8&iwloc=&output=embed' },
  stats: [
    { icon: 'FaTrophy', label: '15+ Years', sub: 'Experience' },
    { icon: 'FaCouch', label: '1000+', sub: 'Designs' },
    { icon: 'FaTree', label: 'Solid Wood', sub: 'Premium Quality' },
    { icon: 'FaTruck', label: 'Free Delivery', sub: 'Local Shipping' }
  ]
}, { timestamps: true });

module.exports = mongoose.models.About || mongoose.model('About', AboutSchema);
