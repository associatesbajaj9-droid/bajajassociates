import { createRequire } from 'module';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Load models
const Category = require('../api/models/Category.js');
const Tile = require('../api/models/Tile.js');

const categoriesData = [
  {
    id: "sofas-seating",
    name: "Sofas & Seating",
    nameHi: "सोफे और बैठने की जगह",
    icon: "🛋️",
    cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    description: "Luxurious sofas, sectional seating, and custom accent chairs designed for comfort."
  },
  {
    id: "dining-room",
    name: "Dining Tables & Chairs",
    nameHi: "डाइनिंग टेबल और कुर्सियाँ",
    icon: "🍽️",
    cover: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80",
    description: "Handcrafted solid wood dining tables and elegant upholstered chairs."
  },
  {
    id: "bedroom",
    name: "Bedroom Furniture",
    nameHi: "बेडरूम का फर्नीचर",
    icon: "🛏️",
    cover: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    description: "Premium beds, custom headboards, and spacious walnut closets."
  },
  {
    id: "study-office",
    name: "Study & Home Office",
    nameHi: "अध्ययन और गृह कार्यालय",
    icon: "✍️",
    cover: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    description: "Ergonomic study chairs, solid wood desks, and sleek wooden bookcases."
  },
  {
    id: "home-decor",
    name: "Decor & Lighting",
    nameHi: "सजावट और प्रकाश व्यवस्था",
    icon: "💡",
    cover: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    description: "Statement arched floor lamps, round wall mirrors, and abstract woolen rugs."
  },
  {
    id: "outdoor",
    name: "Outdoor & Patio",
    nameHi: "आउटडोर और आँगन",
    icon: "☀️",
    cover: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    description: "Weather-resistant teak dining sets and plush PE rattan daybeds."
  }
];

const productsData = [
  // sofas-seating
  { name: "Chesterfield Velvet Sofa", price: "₹45,000", category: "sofas-seating", description: "Classic deep-buttoned velvet sofa with plush rolled arms.", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", stockStatus: true },
  { name: "Nordic Accent Armchair", price: "₹18,500", category: "sofas-seating", description: "Minimalist armchair upholstered in soft boucle fabric with oak legs.", imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80", stockStatus: true },
  { name: "L-Shape Sectional Sofa", price: "₹62,000", category: "sofas-seating", description: "Spacious and modular sectional sofa in neutral grey linen.", imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80", stockStatus: true },
  { name: "Mid-Century Modern Loveseat", price: "₹32,000", category: "sofas-seating", description: "Sleek and stylish loveseat featuring tapered wooden legs and premium teal fabric.", imageUrl: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80", stockStatus: true },
  { name: "Leather Recliner Chair", price: "₹28,000", category: "sofas-seating", description: "Premium genuine leather recliner with ultra-plush cushioning.", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", stockStatus: true },
  { name: "Velvet Chaise Lounge", price: "₹36,000", category: "sofas-seating", description: "Elegant chaise lounge perfect for reading or relaxing, upholstered in rich maroon velvet.", imageUrl: "https://images.unsplash.com/photo-1616486028008-54e449a5180c?w=600&q=80", stockStatus: false },

  // dining-room
  { name: "Solid Oak Dining Table", price: "₹32,000", category: "dining-room", description: "Mid-century solid oak table that comfortably seats six.", imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&q=80", stockStatus: true },
  { name: "Leather Dining Chair (Set of 2)", price: "₹12,000", category: "dining-room", description: "Sophisticated tan leather dining chairs with brass steel frame.", imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80", stockStatus: true },
  { name: "Marble Top Dining Table", price: "₹54,000", category: "dining-room", description: "Stunning white Carrara marble dining table with walnut base.", imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80", stockStatus: true },
  { name: "Velvet Dining Chair (Set of 2)", price: "₹14,500", category: "dining-room", description: "Luxurious velvet dining chairs with gold-finished metallic legs.", imageUrl: "https://images.unsplash.com/photo-1592078615290-07e15e8b792e?w=600&q=80", stockStatus: true },
  { name: "Live Edge Acacia Dining Table", price: "₹48,000", category: "dining-room", description: "Unique live edge solid acacia wood table with industrial black iron legs.", imageUrl: "https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600&q=80", stockStatus: true },

  // bedroom
  { name: "King Size Tufted Bed", price: "₹38,000", category: "bedroom", description: "Elegant upholstered bed frame with a high tufted headboard.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80", stockStatus: true },
  { name: "Walnut 3-Door Wardrobe", price: "₹42,000", category: "bedroom", description: "Premium walnut wardrobe with built-in drawers and full-length mirror.", imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80", stockStatus: true },
  { name: "Oak Nightstand", price: "₹6,500", category: "bedroom", description: "Minimalist wooden nightstand with soft-close drawers.", imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&q=80", stockStatus: true },
  { name: "Queen Size Platform Bed", price: "₹28,500", category: "bedroom", description: "Sleek low-profile platform bed crafted from solid ash wood.", imageUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80", stockStatus: true },
  { name: "Mirrored Dresser", price: "₹22,000", category: "bedroom", description: "Spacious six-drawer dresser with a modern mirrored finish.", imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&q=80", stockStatus: true },

  // study-office
  { name: "Bespoke Writing Desk", price: "₹16,500", category: "study-office", description: "Solid wood study desk with drawer storage and wire management.", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80", stockStatus: true },
  { name: "Ergonomic Executive Chair", price: "₹14,500", category: "study-office", description: "High-back mesh chair with adjustable lumbar support and armrests.", imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&q=80", stockStatus: true },
  { name: "Modular Bookcase", price: "₹19,000", category: "study-office", description: "Industrial style metal and wood bookcase with five wide shelves.", imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80", stockStatus: true },
  { name: "Standing Desk Converter", price: "₹8,000", category: "study-office", description: "Adjustable sit-stand desk converter for ergonomic working.", imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", stockStatus: true },

  // home-decor
  { name: "Minimalist Arch Floor Lamp", price: "₹8,900", category: "home-decor", description: "Brushed gold arched floor lamp with a heavy marble base.", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", stockStatus: true },
  { name: "Round Brass Wall Mirror", price: "₹5,200", category: "home-decor", description: "Sleek round mirror with a thin brushed brass metal frame.", imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80", stockStatus: true },
  { name: "Abstract Woolen Area Rug", price: "₹14,000", category: "home-decor", description: "Soft hand-tufted woolen rug with contemporary geometric patterns.", imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&q=80", stockStatus: true },
  { name: "Ceramic Table Vase Set", price: "₹3,500", category: "home-decor", description: "Set of three textured ceramic vases in muted earthy tones.", imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd1d55?w=600&q=80", stockStatus: true },
  { name: "Geometric Pendant Light", price: "₹6,800", category: "home-decor", description: "Matte black geometric pendant light perfect for over the dining table.", imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80", stockStatus: true },

  // outdoor
  { name: "Teak Patio Dining Set", price: "₹48,000", category: "outdoor", description: "Durable solid teak outdoor table with four matching folding chairs.", imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80", stockStatus: true },
  { name: "PE Rattan Daybed", price: "₹24,000", category: "outdoor", description: "Weatherproof synthetic rattan daybed with plush outdoor cushions.", imageUrl: "https://images.unsplash.com/photo-1582239401918-6da134bfecf5?w=600&q=80", stockStatus: true },
  { name: "Hanging Egg Chair", price: "₹18,000", category: "outdoor", description: "Comfortable swinging egg chair with steel stand and soft cushion.", imageUrl: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97b?w=600&q=80", stockStatus: true },
  { name: "Outdoor Fire Pit Table", price: "₹32,500", category: "outdoor", description: "Modern gas fire pit table perfect for chilly evenings on the patio.", imageUrl: "https://images.unsplash.com/photo-1499803270242-467f7012eb2d?w=600&q=80", stockStatus: false }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Clear Category
    console.log('Clearing Category collection...');
    await Category.deleteMany({});
    console.log('Cleared Category.');

    // Clear Tiles (Products)
    console.log('Clearing Tile (Product) collection...');
    await Tile.deleteMany({});
    console.log('Cleared Tile.');

    // Seed Categories
    console.log('Seeding Category collection...');
    const createdCats = await Category.insertMany(categoriesData);
    console.log(`Successfully seeded ${createdCats.length} categories.`);

    // Seed Tiles (Products)
    console.log('Seeding Tile (Product) collection...');
    const createdTiles = await Tile.insertMany(productsData);
    console.log(`Successfully seeded ${createdTiles.length} products.`);

    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
