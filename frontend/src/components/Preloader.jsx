import React from "react";

const Preloader = ({ fadeOut }) => {
  return (
    <div className={`preloader ${fadeOut ? "preloader-fade" : ""}`}>
      <div className="preloader-content">
        <div className="loader-logo">Bajaj Associates</div>
        <div className="loader-bar">
          <div className="loader-progress" />
        </div>
        <p>Crafting luxury furniture for your home...</p>
      </div>
    </div>
  );
};

export default Preloader;
