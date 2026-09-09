import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaMapMarkerAlt, FaPhone, FaHeart, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch((err) => console.error("Failed to load footer data", err));
  }, []);

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

  const phone = footerData?.phone || import.meta.env.VITE_PHONE_NUMBER || "7225001109";
  const email = footerData?.email || "bajajassociates.furniture@gmail.com";
  const igLink = footerData?.instagramLink || import.meta.env.VITE_INSTAGRAM_LINK || "https://www.instagram.com/singhai.harshjain";
  const mapLink = footerData?.mapEmbedUrl || import.meta.env.VITE_MAPS_LINK || "https://maps.app.goo.gl/rbXvJT3BbKEgCAqw5";
  const address = footerData?.address || "Housing board, Subhash nagar, ward no 75\nmaharajpur, jabalpur, madhyapradesh";
  const mapEmbedUrl = footerData?.mapEmbedUrl || "https://maps.google.com/maps?q=Housing%20board%20,%20Subhash%20nagar%20,%20ward%20no%2075%20maharajpur%20,jabalpur%20,madhyapradesh&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo" style={{fontFamily: "'Playfair Display', serif", textTransform: "uppercase"}}>Bajaj Associates</span>
          <div className="brand-tagline">Elegant Furniture for Modern Living</div>
          <p className="footer-brand-desc" style={{ marginTop: "12px", whiteSpace: "pre-line" }}>
            {address}
          </p>
        </div>

        {/* Social / Contact links */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Connect</h4>
          <div className="footer-link-list">
            <a href={`tel:+91${phone}`} className="footer-link-item">
              <FaPhone size={14} />
              <span>+91 {phone}</span>
            </a>
            <a href={`mailto:${email}`} className="footer-link-item">
              <FaEnvelope size={14} />
              <span>{email}</span>
            </a>
            <a href={igLink} target="_blank" rel="noopener noreferrer" className="footer-link-item">
              <FaInstagram size={14} />
              <span>Instagram</span>
            </a>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="footer-link-item footer-map">
              <FaMapMarkerAlt size={14} />
              <span>Find Our Shop</span>
            </a>
          </div>
        </div>

        {/* Embedded map */}
        <div className="footer-map-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 className="footer-col-title" style={{ marginBottom: 0 }}>Location</h4>
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="150"
            style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)" }}
            allowFullScreen=""
            loading="lazy"
            title="Bajaj Associates Location Map"
          ></iframe>
          <a
            href={mapLink}
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
          © {new Date().getFullYear()} <strong>Bajaj Associates</strong> · All rights reserved
        </p>
        <p className="footer-credit">
          Made with <FaHeart className="footer-heart" size={12} /> by
          <span className="footer-dev-name"><a href="http://collabsponsor.com" target="_blank" rel="noopener noreferrer"> collabsponsor </a></span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;