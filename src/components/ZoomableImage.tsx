import React, { useRef, useEffect, useState } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  zoomRegion: { x: number; y: number; width: number; height: number } | null;
  enableZoom: boolean;
  onImageLoad?: (imageElement: HTMLImageElement) => void;
  className?: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  zoomRegion,
  enableZoom,
  onImageLoad,
  className = ''
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Apply zoom effect when the zoom region changes
  useEffect(() => {
    const applyZoom = () => {
      const image = imageRef.current;
      const container = containerRef.current;
      
      if (!image || !container) return;
      
      // Reset transforms
      image.style.transform = '';
      image.style.width = '';
      image.style.height = '';
      image.style.maxWidth = '';
      image.style.maxHeight = '';
      
      if (enableZoom && zoomRegion) {
        // Calculate the scale factor to zoom in
        const scaleX = 1 / zoomRegion.width;
        const scaleY = 1 / zoomRegion.height;
        const scale = Math.min(scaleX, scaleY);
        
        // Apply the transformation
        // First translate to center the zoom region, then scale
        const translateX = -zoomRegion.x * 100;
        const translateY = -zoomRegion.y * 100;
        
        image.style.transformOrigin = '0 0';
        image.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
      } else {
        // Reset to fit container when zoom is disabled
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'contain';
      }
    };
    
    if (isLoaded) {
      applyZoom();
    }
  }, [zoomRegion, enableZoom, isLoaded]);
  
  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
    setError(false);
    
    if (imageRef.current && onImageLoad) {
      onImageLoad(imageRef.current);
    }
  };
  
  // Handle image loading error
  const handleImageError = () => {
    setIsLoaded(false);
    setError(true);
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full ${className}`}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-red-500">Error loading image</p>
        </div>
      )}
      
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${isLoaded ? '' : 'hidden'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ZoomableImage;