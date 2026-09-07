import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes, FaHome, FaInfoCircle } from "react-icons/fa";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9111999271";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to enquire about Bajaj Associates furniture.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const handleLogoClick = () => {
    closeMenu();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={handleLogoClick}>
        Bajaj Associates
      </div>

      <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
           <span className="mobile-logo">Bajaj Associates</span>
           <FaTimes className="mobile-close" onClick={closeMenu} size={24} />
        </div>

        <span className="nav-link-item" onClick={handleLogoClick}>
          <FaHome className="nav-icon-mobile" />
          Home
        </span>
        
        <span
          className="nav-link-item"
          onClick={() => { closeMenu(); navigate("/about"); }}
        >
          <FaInfoCircle className="nav-icon-mobile" />
          About
        </span>

        <button className="wa-btn nav-wa-btn" onClick={openWhatsApp}>
          <FaWhatsapp size={18} />
          <span>Contact</span>
        </button>

        <div className="mobile-footer">
          <p>© 2026 Bajaj Associates. Premium Quality.</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;