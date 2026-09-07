const BASE_URL = '/api';

export async function fetchCategories() {
  try {
    const [catRes, tilesRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/tiles')
    ]);

    if (!catRes.ok || !tilesRes.ok) {
      throw new Error('Failed to fetch data from database API');
    }

    const categories = await catRes.json();
    const tiles = await tilesRes.json();

    // Map database structures to the frontend's expected structures:
    return categories.map(cat => {
      // Find all tiles belonging to this category
      const catTiles = tiles.filter(tile => tile.category === cat.id);
      
      return {
        id: cat.id,
        name: cat.name,
        nameHi: cat.nameHi,
        icon: cat.icon,
        cover: cat.cover,
        description: cat.description,
        items: catTiles.map(tile => ({
          id: tile._id, // map DB _id to frontend item.id
          title: tile.name, // map DB name to frontend item.title
          price: tile.price,
          desc: tile.description,
          image: tile.imageUrl, // map DB imageUrl to frontend item.image
          isOutOfStock: !tile.stockStatus // map DB stockStatus to frontend item.isOutOfStock
        }))
      };
    });
  } catch (err) {
    console.error('Database API Error, falling back to dummy data:', err);
    try {
      const res = await fetch('/dummy-data.json');
      if (!res.ok) throw new Error('Failed to fetch dummy data');
      return await res.json();
    } catch (fallbackErr) {
      console.error('Fallback Error:', fallbackErr);
      throw err;
    }
  }
}

export async function fetchCategoryById(id) {
  const data = await fetchCategories();
  const cat = data.find((c) => c.id === id);
  if (!cat) throw new Error(`Category "${id}" not found`);
  return cat;
}

export async function fetchProductById(id) {
  const data = await fetchCategories();
  for (const cat of data) {
    const item = cat.items.find((i) => i.id === id);
    if (item) return { item, category: cat };
  }
  throw new Error(`Product "${id}" not found`);
}

export async function fetchTilesGrouped() {
  return fetchCategories();
}

