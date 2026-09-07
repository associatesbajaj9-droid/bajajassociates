import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useWishlist } from "../contexts/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import OptimizedImage from "./OptimizedImage";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9111999271";

/* Album is the legacy single-page view — kept for backwards compat.
   Wishlist is now managed by the global WishlistContext. */
const Album = () => {
  const { data: categories, loading, error } = useCategories();
  const [activeCategory, setActiveCategory] = useState(null);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const sendToWhatsApp = (item) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in: ${item.title} — ${item.price}\nImage: ${item.image}`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`);
  };

  return (
    <>
      {/* 🔥 HERO */}
      <section className="hero">
        <h1 style={{ fontFamily: "'Playfair Display', serif", textTransform: "uppercase" }}>Bajaj Associates</h1>
        <div className="brand-tagline" style={{ fontSize: "42px", marginBottom: "20px" }}>Elegant Furniture for Modern Living</div>
      </section>

      {/* 🟡 CATEGORIES */}
      {!activeCategory && (
        <section className="categories-grid">
          {loading && <p>Loading categories...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => setActiveCategory(cat)}
            >
              <OptimizedImage src={cat.cover} className="category-image" alt={cat.name} sizes="(max-width: 768px) 100vw, 33vw" />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </section>
      )}

      {/* 🔵 PRODUCTS */}
      {activeCategory && (
        <>
          <button className="back-btn" onClick={() => setActiveCategory(null)}>← Back</button>

          {/* FILTERS */}
          <div className="filters" style={{ padding: "12px 20px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className={`filter-btn ${hideOutOfStock ? "active" : ""}`}
              onClick={() => setHideOutOfStock(!hideOutOfStock)}
              style={{
                padding: "8px 14px",
                backgroundColor: hideOutOfStock ? "var(--red)" : "var(--card)",
                color: hideOutOfStock ? "#fff" : "var(--text-h)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              {hideOutOfStock ? "✔ Hiding Out of Stock" : "Show All"}
            </button>
          </div>

          <section className="products-grid">
            {activeCategory.items
              .filter((item) => !hideOutOfStock || !item.isOutOfStock)
              .map((item) => {
                const added = isWishlisted(item.id);
                return (
                  <div
                    key={item.id}
                    className={`product-card ${item.isOutOfStock ? "out-of-stock" : ""}`}
                  >
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <OptimizedImage
                        src={item.image || "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop"}
                        className="product-image"
                        alt={item.title}
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                        style={{ filter: item.isOutOfStock ? "grayscale(80%) brightness(0.75)" : "none" }}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop"; }}
                      />
                      {item.isOutOfStock && (
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "rgba(0,0,0,0.35)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{
                            background: "var(--red)", color: "#fff",
                            padding: "6px 14px", borderRadius: 6,
                            fontSize: 13, fontWeight: "bold"
                          }}>
                            OUT OF STOCK
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3>{item.title}</h3>
                      <p className="product-price" style={{
                        textDecoration: item.isOutOfStock ? "line-through" : "none",
                        opacity: item.isOutOfStock ? 0.5 : 1,
                      }}>
                        {item.price}
                      </p>
                      <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '8px', lineHeight: '1.2' }}>
                        *Disclaimer: Cushioning fabrics and wood carving details are subject to availability; actual product may vary.
                      </p>

                      <div className="product-actions">
                        <button
                          className={`wishlist-btn ${added ? "added" : ""}`}
                          onClick={() => !item.isOutOfStock && toggleWishlist(item)}
                          disabled={item.isOutOfStock}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                        >
                          {item.isOutOfStock
                            ? "Out of Stock"
                            : added
                              ? <><FaHeart size={12} /> Wishlisted</>
                              : <><FaRegHeart size={12} /> Wishlist</>
                          }
                        </button>
                        {!item.isOutOfStock && (
                          <button
                            className="wa-btn wa-card-btn"
                            onClick={() => sendToWhatsApp(item)}
                            style={{ padding: "9px 12px" }}
                            title="Enquire on WhatsApp"
                          >
                            💬
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </section>
        </>
      )}

      {/* 🧾 ABOUT */}
      <section className="about">
        <h2>About Us</h2>
        <p>We provide premium quality handcrafted furniture for luxury homes and spaces.</p>
      </section>

      {/* 📞 CTA */}
      <section className="cta">
        <h2>Need Help?</h2>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I need help choosing furniture.")}`}
          target="_blank"
          rel="noreferrer"
          className="wa-btn"
        >
          Chat on WhatsApp
        </a>
      </section>

      {/* 🪵 FOOTER */}
      <footer className="footer">
        <p>© 2026 Bajaj Associates</p>
      </footer>
    </>
  );
};

export default Album;