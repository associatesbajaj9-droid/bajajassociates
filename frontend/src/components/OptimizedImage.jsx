import React, { useState } from 'react';
import './OptimizedImage.css';

/**
 * OptimizedImage
 * Automatically injects Cloudinary transformations (WebP/AVIF, resizing, blur placeholders)
 * Falls back to standard lazy loading for non-Cloudinary images.
 */

// Helper to inject Cloudinary transformations
const getCloudinaryUrl = (url, width, blur = false) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  
  // Cloudinary URLs: https://res.cloudinary.com/<cloud_name>/image/upload/v1234/folder/img.jpg
  // We want to insert transformations after /upload/
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url; // Unexpected format
  
  let transformations = `f_auto,q_auto`; // Next-gen formats & auto compression
  
  if (width) {
    transformations += `,w_${width},c_limit`; // Resize to specified width
  }
  
  if (blur) {
    // e_blur:1000 creates a strong blur. w_50 makes the placeholder tiny (~1KB)
    transformations = `f_auto,q_1,w_50,e_blur:1000`; 
  }
  
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes = '(max-width: 768px) 100vw, 50vw',
  srcSetWidths = [400, 800, 1200, 1600],
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isCloudinary = src && src.includes('res.cloudinary.com');
  
  let defaultSrc = src;
  let placeholderSrc = src; // Will be the same if not Cloudinary
  let srcSet = undefined;
  
  if (isCloudinary && !hasError) {
    defaultSrc = getCloudinaryUrl(src, 800); // Default to reasonable width
    placeholderSrc = getCloudinaryUrl(src, null, true); // Tiny blurred version
    srcSet = srcSetWidths.map(w => `${getCloudinaryUrl(src, w)} ${w}w`).join(', ');
  }

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    if (props.onError) props.onError();
  };

  // If it's a standard URL (like Unsplash), bypass wrappers to perfectly preserve card CSS layouts
  if (!isCloudinary) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <div className={`opt-image-wrapper ${className}`}>
      {!hasError && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="opt-image opt-placeholder"
          style={{ opacity: isLoaded ? 0 : 1 }}
          aria-hidden="true"
        />
      )}
      
      <img
        src={defaultSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`opt-image opt-main opt-absolute`}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
        style={{ 
          opacity: isLoaded ? 1 : 0,
          ...(props.style || {})
        }}
      />
    </div>
  );
};

export default OptimizedImage;
