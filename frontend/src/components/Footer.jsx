import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaMapMarkerAlt, FaPhone, FaHeart, FaEnvelope } from "react-icons/fa";

const PHONE    = import.meta.env.VITE_PHONE_NUMBER    || "9111999271";
const EMAIL    = "bajajassociates.furniture@gmail.com";
const IG_LINK  = import.meta.env.VITE_INSTAGRAM_LINK  || "https://www.instagram.com/bajajassociates";
const MAP_LINK = import.meta.env.VITE_MAPS_LINK       || "https://www.google.com/maps/search/?api=1&query=53%2F33+Rameshwaram+Colony%2C+Beside+New+Laxmi+Pratisthan%2C+Vijay+Nagar+Main+Road%2C+Jabalpur+482002+%28M.P.%29";

const Footer = () => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef(null);

  const handleSecretClick = () => {
    setClicks((prev) => prev + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setClicks(0), 2000);
  };

  useEffect(() => {
    if (clicks >= 5) {
      navigate("/admin/login");
      setClicks(0);
    }
  }, [clicks, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo" style={{fontFamily: "'Playfair Display', serif", textTransform: "uppercase"}}>Bajaj Associates</span>
          <div className="brand-tagline">Elegant Furniture for Modern Living</div>
          <p className="footer-brand-desc" style={{ marginTop: "12px" }}>
            53/33 Rameshwaram Colony,<br />
            Beside New Laxmi Pratisthan,<br />
            Vijay Nagar Main Road,<br />
            Jabalpur 482002 (M.P.)
          </p>
        </div>

        {/* Social / Contact links */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Connect</h4>
          <div className="footer-link-list">
            <a href={`tel:+91${PHONE}`} className="footer-link-item">
              <FaPhone size={14} />
              <span>+91 {PHONE}</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="footer-link-item">
              <FaEnvelope size={14} />
              <span>Email Us</span>
            </a>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="footer-link-item footer-map">
              <FaMapMarkerAlt size={14} />
              <span>Find Our Shop</span>
            </a>
          </div>
        </div>

        {/* Embedded map */}
        <div className="footer-map-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 className="footer-col-title" style={{ marginBottom: 0 }}>Location</h4>
          <iframe
            src="https://maps.google.com/maps?q=53/33%20Rameshwaram%20Colony,%20Beside%20New%20Laxmi%20Pratisthan,%20Vijay%20Nagar%20Main%20Road,%20Jabalpur%20482002%20(M.P.)&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="150"
            style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)" }}
            allowFullScreen=""
            loading="lazy"
            title="Bajaj Associates Location Map"
          ></iframe>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link-item footer-map"
            style={{ fontSize: '12px' }}
          >
            <span>Open in Google Maps ↗</span>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p
          className="footer-copy"
          onClick={handleSecretClick}
          style={{ cursor: "default", userSelect: "none" }}
        >
          © 2026 <strong>Bajaj Associates</strong> · All rights reserved
        </p>
        <p className="footer-credit">
          Made with <FaHeart className="footer-heart" size={12} /> by
          <span className="footer-dev-name"><a href="http://collabsponsor.com">collabsponsor </a></span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;