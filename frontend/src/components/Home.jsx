import React from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { useCategories } from "../hooks/useCategories";
import Footer from "./Footer";
import Hero from "./Hero";
import OptimizedImage from "./OptimizedImage";

const FEATURED = new Set(["sofas-seating", "dining-room", "bedroom"]);
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9111999271";

const Skeleton = () => (
  <div className="categories-loading-wrapper">
    <div className="categories-loading-text-container">
      <div className="loading-spinner-dot" />
      <span className="loading-text">Loading categories...</span>
    </div>
    <div className="categories-loading-bar">
      <div className="categories-loading-bar-fill" />
    </div>
    <div className="categories-grid" style={{ padding: "0 0 44px 0" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="category-card skeleton-card">
          <div className="skeleton skeleton-img" />
          <div className="category-label">
            <div className="skeleton skeleton-line" style={{ width: "60%", height: 14 }} />
            <div className="skeleton skeleton-line" style={{ width: "90%", height: 11, marginTop: 6 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Home = () => {
  const { data: categories, loading, error } = useCategories();

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to enquire about your luxury furniture collections.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const scrollToCategories = () => {
    document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">

      {/* ── HERO ── */}
      <Hero />

      {/* ── STATS SECTION ── */}
      <div className="stats-section">
        <div className="stats-grid">
          {[
            { num: "8+",   label: "Collections", desc: "Curated design themes" },
            { num: "500+", label: "Happy Homes", desc: "Transforming living spaces" },
            { num: "Bespoke", label: "Designs", desc: "Tailored to your lifestyle" },
            { num: "Premium", label: "Quality", desc: "Handcrafted with detail" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-glow" />
              <span className="stat-number">{s.num}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div id="categories-section" className="section-header">
        <h2 className="section-title">Our Categories</h2>
        {categories && (
          <span className="section-sub">{categories.length} collections</span>
        )}
      </div>

      {error && (
        <p className="api-error">Could not load categories. Please refresh.</p>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <div className="categories-grid">
          {categories?.map((cat) => (
            <Link
              to={`/category/${cat.id}`}
              key={cat.id}
              className={`category-card ${FEATURED.has(cat.id) ? "featured" : ""}`}
            >
              <OptimizedImage 
                src={cat.cover || "https://images.unsplash.com/photo-1517646331032-9e8563c520a1?q=80&w=800&auto=format&fit=crop"} 
                className="category-image" 
                alt={cat.name}
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1517646331032-9e8563c520a1?q=80&w=800&auto=format&fit=crop"; }}
              />
              <div className="category-label">
                <span className="category-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── WHATSAPP FAB ── */}
      {createPortal(
        <button 
          className="wa-global-fab"
          onClick={openWhatsApp}
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={32} />
        </button>,
        document.body
      )}

      <Footer />
    </div>
  );
};

export default Home;