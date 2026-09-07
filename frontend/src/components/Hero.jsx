import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToCategories = () => {
    document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bajaj-hero" aria-label="Bajaj Associates furniture collection">
      <div className="hero-ambient-orb orb-1" aria-hidden="true" />
      <div className="hero-ambient-orb orb-2" aria-hidden="true" />

      <picture className="bajaj-hero-media" aria-hidden="true">
        <source media="(min-width: 769px)" srcSet="/bajaj-hero-desktop.png" />
        <img src="/bajaj-hero-mobile.png" alt="" />
      </picture>

      <div className="bajaj-hero-overlay" />

      <div className="bajaj-hero-content">
        <div className="bajaj-hero-copy">
          <p className="bajaj-eyebrow">Premium Furniture Collection</p>

          <h1 className="bajaj-title">
            <span>Bajaj</span> Associates
          </h1>

          <h2>Elegant Furniture for Modern Living</h2>

          <p className="bajaj-description">
            Crafted comfort, timeless style, and premium pieces for every home.
          </p>

          <div className="bajaj-hero-actions">
            <button className="bajaj-primary-btn" onClick={scrollToCategories}>
              Shop Collection <span aria-hidden="true">→</span>
            </button>
            <button className="bajaj-secondary-btn" onClick={() => navigate("/about")}>
              Explore More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
