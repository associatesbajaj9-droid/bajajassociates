const connectDB = require('./lib/db');
const About = require('./models/About');

const defaultAboutData = {
  title: 'About Bajaj Associates',
  badge: 'Our Story',
  tagline: 'Premium furniture & decor trusted by 500+ happy homes',
  story1: "With over 15 years of experience, Bajaj Associates is your trusted source for premium handcrafted sofas, elegant dining sets, bespoke beds, luxury wardrobes, study desks, and contemporary home decor. We serve homeowners, interior designers, and architects across the region — delivering comfort, durability, and elegance at every budget.",
  story2: "Our expert team helps you choose the perfect furniture to match your vision — whether it's a luxury home makeover or a modern office setup. Visit our showroom or browse our digital collections to explore hundreds of curated designs.",
  phone: '9111999271',
  instagramLink: 'https://www.instagram.com/singhai.harshjain',
  storeImageUrl: '',
  address: '53/33 Rameshwaram Colony, Beside New Laxmi Pratisthan, Vijay Nagar Main Road, Jabalpur 482002 (M.P.)',
  mapEmbedUrl: 'https://maps.google.com/maps?q=53/33%20Rameshwaram%20Colony,%20Beside%20New%20Laxmi%20Pratisthan,%20Vijay%20Nagar%20Main%20Road,%20Jabalpur%20482002%20(M.P.)&t=&z=16&ie=UTF8&iwloc=&output=embed',
  stats: [
    { icon: 'FaTrophy', label: '15+ Years', sub: 'Experience' },
    { icon: 'FaCouch', label: '1000+', sub: 'Designs' },
    { icon: 'FaTree', label: 'Solid Wood', sub: 'Premium Quality' },
    { icon: 'FaTruck', label: 'Free Delivery', sub: 'Local Shipping' }
  ]
};

module.exports = async (req, res) => {
  try {
    await connectDB();

    if (req.method === 'GET') {
      let aboutData = await About.findOne();
      if (!aboutData) {
        aboutData = await About.create(defaultAboutData);
      }
      return res.status(200).json(aboutData);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const cookies = req.headers.cookie;
      const isAuthenticated = cookies && cookies.includes('admin_session=authenticated');
      if (!isAuthenticated) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      let aboutData = await About.findOne();
      if (aboutData) {
        Object.assign(aboutData, req.body);
        await aboutData.save();
      } else {
        aboutData = await About.create({ ...defaultAboutData, ...req.body });
      }

      return res.status(200).json({ message: 'About section updated successfully', data: aboutData });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API /api/about error:', error);
    return res.status(500).json({ error: error.message });
  }
};
