import React from "react";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhone, FaStore, FaTrophy, FaCouch, FaTree, FaTruck } from "react-icons/fa";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9111999271";
const PHONE    = import.meta.env.VITE_PHONE_NUMBER    || "9111999271";
const IG_LINK  = import.meta.env.VITE_INSTAGRAM_LINK  || "https://www.instagram.com/singhai.harshjain";
const MAP_LINK = import.meta.env.VITE_MAPS_LINK       || "https://www.google.com/maps/search/?api=1&query=53%2F33+Rameshwaram+Colony%2C+Beside+New+Laxmi+Pratisthan%2C+Vijay+Nagar+Main+Road%2C+Jabalpur+482002+%28M.P.%29";

const About = () => {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to know more about Bajaj Associates furniture store.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <section className="about-page" id="about-section">
      {/* ── HEADER ── */}
      <div className="about-header">
        <div className="about-badge">Our Story</div>
        <h1>About Bajaj Associates</h1>
        <p className="about-tagline">
          Premium furniture & decor trusted by 500+ happy homes
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="about-body">

        {/* Image + Identity Card */}
        <div className="about-identity">
          <div className="about-image-wrapper">
            <div className="about-image-placeholder">
              <FaStore size={48} style={{ color: "var(--accent)", opacity: 0.5 }} />
              <span>Shop Photo</span>
              <p>Replace with your store image via admin or env config</p>
            </div>
            {/* Uncomment and set src when image is available */}
            {/* <img src="/store.jpg" alt="Bajaj Associates Store" className="about-store-img" /> */}
          </div>

          {/* Quick-contact socials card */}
          <div className="about-socials-card">
            <h3>Connect With Us</h3>
            <div className="about-social-links">
              <a href={`tel:+91${PHONE}`} className="about-social-item about-phone">
                <FaPhone size={18} />
                <span>+91 {PHONE}</span>
              </a>
              <button className="about-social-item about-wa" onClick={openWhatsApp}>
                <FaWhatsapp size={18} />
                <span>WhatsApp Us</span>
              </button>
              <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="about-social-item about-ig">
                <FaInstagram size={18} />
                <span>Instagram</span>
              </a>
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="about-social-item about-map">
                <FaMapMarkerAlt size={18} />
                <span>Locate Our Shop</span>
              </a>
            </div>
          </div>

          {/* Showroom Location Card */}
          <div className="about-socials-card">
            <h3>Our Showroom Address</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              53/33 Rameshwaram Colony,<br />
              Beside New Laxmi Pratisthan,<br />
              Vijay Nagar Main Road,<br />
              Jabalpur 482002 (M.P.)
            </p>
            <iframe
              src="https://maps.google.com/maps?q=53/33%20Rameshwaram%20Colony,%20Beside%20New%20Laxmi%20Pratisthan,%20Vijay%20Nagar%20Main%20Road,%20Jabalpur%20482002%20(M.P.)&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="200"
              style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)" }}
              allowFullScreen=""
              loading="lazy"
              title="Bajaj Associates Showroom Map"
            ></iframe>
          </div>
        </div>

        {/* About text */}
        <div className="about-text-block">
          <div className="about-highlight-bar">
            {[
              { icon: <FaTrophy />, label: "15+ Years", sub: "Experience" },
              { icon: <FaCouch />, label: "1000+",        sub: "Designs" },
              { icon: <FaTree />, label: "Solid Wood",   sub: "Premium Quality" },
              { icon: <FaTruck />, label: "Free Delivery", sub: "Local Shipping" },
            ].map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat-icon">{s.icon}</span>
                <strong>{s.label}</strong>
                <span>{s.sub}</span>
              </div>
            ))}
          </div>

          <p>
            With over 15 years of experience, Bajaj Associates is your trusted source for premium handcrafted sofas, elegant dining sets, bespoke beds, luxury wardrobes, study desks, and contemporary home decor. We serve homeowners, interior designers, and architects across the region — delivering comfort, durability, and elegance at every budget.
          </p>
          <p>
            Our expert team helps you choose the perfect furniture to match your vision — whether it's a luxury home makeover or a modern office setup. Visit our showroom or browse our digital collections to explore hundreds of curated designs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;