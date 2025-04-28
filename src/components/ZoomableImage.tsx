// import { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';

// interface ZoomableImageProps {
//   src: string;
//   alt: string;
//   zoomFactor?: number;
//   zoomPosition: { x: number, y: number } | null;
//   setZoomPosition: (position: { x: number, y: number } | null) => void;
//   isZoomEnabled: boolean;
//   onImageClick: (imageData: { src: string, alt: string, folder: string }) => void;
//   folder: string;
//   error?: boolean;
//   loading?: boolean;
// }

// export default function ZoomableImage({
//   src,
//   alt,
//   zoomFactor = 2.5,
//   zoomPosition = null,
//   setZoomPosition = () => {},
//   isZoomEnabled = false,
//   onImageClick = () => {},
//   folder,
//   error = false,
//   loading = false,
// }: ZoomableImageProps) {
//   const imageContainerRef = useRef<HTMLDivElement>(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
//   const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Handle image load to get dimensions
//   const handleImageLoad = (e: any) => {
//     if (imageContainerRef.current) {
//       // Get container dimensions
//       const { width, height } = imageContainerRef.current.getBoundingClientRect();
//       setDimensions({ width, height });
      
//       // Try to get natural dimensions
//       const img = e.target;
//       if (img.naturalWidth && img.naturalHeight) {
//         setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
//       }
      
//       setImageLoaded(true);
//     }
//   };

//   // Update dimensions if container size changes
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (imageContainerRef.current) {
//         const { width, height } = imageContainerRef.current.getBoundingClientRect();
//         setDimensions({ width, height });
//       }
//     };

//     window.addEventListener('resize', updateDimensions);
//     return () => window.removeEventListener('resize', updateDimensions);
//   }, []);

//   // Handle mouse move for zooming
//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isZoomEnabled || !imageLoaded || !imageContainerRef.current) return;
    
//     const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
//     // Calculate position as percentages (0-1)
//     const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
//     const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
//     setZoomPosition({ x, y });
//   };

//   // Handle image click
//   const handleImageClick = () => {
//     onImageClick({ src, alt, folder });
//   };

//   // Calculate zoom styles
//   const getZoomStyles = () => {
//     if (!zoomPosition || !isZoomEnabled || !imageLoaded) {
//       return {};
//     }

//     // Calculate transform properties for zooming
//     const x = zoomPosition.x * 100;
//     const y = zoomPosition.y * 100;
    
//     return {
//       transform: `scale(${zoomFactor})`,
//       transformOrigin: `${x}% ${y}%`,
//     };
//   };

//   // Determine if the container should show zoom cursor
//   const zoomCursorClass = isZoomEnabled ? 'cursor-zoom-in' : '';

//   return (
//     <div 
//       ref={imageContainerRef}
//       className={`relative w-full h-64 border border-gray-200 rounded-md overflow-hidden ${zoomCursorClass}`}
//       onMouseMove={handleMouseMove}
//       onClick={handleImageClick}
//     >
//       {loading ? (
//         <div className="flex items-center justify-center h-full">
//           <p>Loading...</p>
//         </div>
//       ) : error ? (
//         <div className="flex items-center justify-center h-full text-red-500">
//           <p>Error loading image</p>
//         </div>
//       ) : (
//         <Image 
//           src={src}
//           alt={alt}
//           fill
//           sizes="(max-width: 768px) 100vw, 33vw"
//           style={{ 
//             objectFit: 'contain',
//             transition: 'transform 0.1s ease-out',
//             ...getZoomStyles()
//           }}
//           onLoad={handleImageLoad}
//           priority={true}
//           loading="eager"
//           unoptimized={true}
//         />
//       )}
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
// // Rename the imported Next.js Image to avoid conflict with global Image constructor
// import NextImage from 'next/image';

// interface ZoomableImageProps {
//   src: string;
//   alt: string;
//   zoomFactor?: number;
//   zoomPosition: { x: number, y: number } | null;
//   setZoomPosition: (position: { x: number, y: number } | null) => void;
//   isZoomEnabled: boolean;
//   onImageClick: (imageData: { src: string, alt: string, folder: string }) => void;
//   folder: string;
//   error?: boolean;
//   loading?: boolean;
// }

// export default function ZoomableImage({
//   src,
//   alt,
//   zoomFactor = 2.5,
//   zoomPosition = null,
//   setZoomPosition = () => {},
//   isZoomEnabled = false,
//   onImageClick = () => {},
//   folder,
//   error = false,
//   loading = false,
// }: ZoomableImageProps) {
//   const imageContainerRef = useRef<HTMLDivElement>(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
//   const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Handle image load to get dimensions
//   const handleImageLoad = (e: any) => {
//     if (imageContainerRef.current) {
//       // Get container dimensions
//       const { width, height } = imageContainerRef.current.getBoundingClientRect();
//       setDimensions({ width, height });
      
//       // Try to get natural dimensions
//       const img = e.target;
//       if (img.naturalWidth && img.naturalHeight) {
//         setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
//       }
      
//       setImageLoaded(true);
//       console.log(`Image loaded: ${folder}`);
//     }
//   };
  
//   // Preload the image when the component mounts or when the src changes
//   useEffect(() => {
//     if (!src || loading || error) return;
    
//     // Use the global window.Image constructor, not the Next.js component
//     const preloadImg = new window.Image();
//     preloadImg.src = src;
    
//     preloadImg.onload = () => {
//       if (imageContainerRef.current) {
//         setNaturalDimensions({ width: preloadImg.naturalWidth, height: preloadImg.naturalHeight });
//         setImageLoaded(true);
//         console.log(`Preloaded image: ${folder}`);
//       }
//     };
    
//     preloadImg.onerror = () => {
//       console.error(`Failed to preload image: ${folder}`);
//     };
    
//     return () => {
//       preloadImg.onload = null;
//       preloadImg.onerror = null;
//     };
//   }, [src, loading, error, folder]);

//   // Update dimensions if container size changes
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (imageContainerRef.current) {
//         const { width, height } = imageContainerRef.current.getBoundingClientRect();
//         setDimensions({ width, height });
//       }
//     };

//     window.addEventListener('resize', updateDimensions);
//     return () => window.removeEventListener('resize', updateDimensions);
//   }, []);

//   // Handle mouse move for zooming
//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isZoomEnabled || !imageLoaded || !imageContainerRef.current) return;
    
//     const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
//     // Calculate position as percentages (0-1)
//     const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
//     const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
//     setZoomPosition({ x, y });
//   };

//   // Handle image click
//   const handleImageClick = () => {
//     onImageClick({ src, alt, folder });
//   };

//   // Calculate zoom styles
//   const getZoomStyles = () => {
//     if (!zoomPosition || !isZoomEnabled || !imageLoaded) {
//       return {};
//     }

//     // Calculate transform properties for zooming
//     const x = zoomPosition.x * 100;
//     const y = zoomPosition.y * 100;
    
//     return {
//       transform: `scale(${zoomFactor})`,
//       transformOrigin: `${x}% ${y}%`,
//     };
//   };

//   // Determine if the container should show zoom cursor
//   const zoomCursorClass = isZoomEnabled ? 'cursor-zoom-in' : '';

//   return (
//     <div 
//       ref={imageContainerRef}
//       className={`relative w-full h-64 border border-gray-200 rounded-md overflow-hidden ${zoomCursorClass}`}
//       onMouseMove={handleMouseMove}
//       onClick={handleImageClick}
//     >
//       {loading ? (
//         <div className="flex items-center justify-center h-full">
//           <p>Loading...</p>
//         </div>
//       ) : error ? (
//         <div className="flex items-center justify-center h-full text-red-500">
//           <p>Error loading image</p>
//         </div>
//       ) : (
//         <>
//           {/* Hidden image preloader */}
//           <img 
//             src={src}
//             className="hidden"
//             onLoad={(e) => handleImageLoad(e)}
//             alt=""
//           />
          
//           {/* Visible image with Next.js Image component */}
//           <NextImage 
//             src={src}
//             alt={alt}
//             fill
//             sizes="(max-width: 768px) 100vw, 33vw"
//             style={{ 
//               objectFit: 'contain',
//               transition: 'transform 0.1s ease-out',
//               ...getZoomStyles()
//             }}
//             onLoad={(e) => handleImageLoad(e)}
//             priority={true}
//             loading="eager"
//             unoptimized={true}
//           />
//         </>
//       )}
//     </div>
//   );
// }


// 


import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
  zoomFactor?: number;
  zoomPosition: { x: number, y: number } | null;
  setZoomPosition: (position: { x: number, y: number } | null) => void;
  isZoomEnabled: boolean;
  onImageClick?: (imageData: { src: string, alt: string, folder: string }) => void;
  folder: string;
  error?: boolean;
  loading?: boolean;
}

export default function ZoomableImage({
  src,
  alt,
  zoomFactor = 2.5,
  zoomPosition = null,
  setZoomPosition = () => {},
  isZoomEnabled = false,
  onImageClick,
  folder,
  error = false,
  loading = false,
}: ZoomableImageProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle image load to get dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (imageContainerRef.current) {
      // Get container dimensions
      const { width, height } = imageContainerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      
      // Try to get natural dimensions
      const img = e.target as HTMLImageElement;
      if (img.naturalWidth && img.naturalHeight) {
        setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      }
      
      setImageLoaded(true);
    }
  };

  // Update dimensions if container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (imageContainerRef.current) {
        const { width, height } = imageContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle mouse move for zooming
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomEnabled || !imageLoaded || !imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate position as percentages (0-1)
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
    setZoomPosition({ x, y });
  };

  // Handle image click
  const handleImageClick = () => {
    onImageClick?.({ src, alt, folder });
  };

  // Calculate zoom styles
  const getZoomStyles = () => {
    if (!zoomPosition || !isZoomEnabled || !imageLoaded) {
      return {};
    }

    // Calculate transform properties for zooming
    const x = zoomPosition.x * 100;
    const y = zoomPosition.y * 100;
    
    return {
      transform: `scale(${zoomFactor})`,
      transformOrigin: `${x}% ${y}%`,
    };
  };

  // Determine if the container should show zoom cursor
  const zoomCursorClass = isZoomEnabled ? 'cursor-zoom-in' : '';

  return (
    <div 
      ref={imageContainerRef}
      className={`relative w-full h-64 border border-gray-200 rounded-md overflow-hidden ${zoomCursorClass}`}
      onMouseMove={handleMouseMove}
      onClick={handleImageClick}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          <p>Error loading image</p>
        </div>
      ) : (
        <Image 
          src={src}
          alt={alt}
          fill
          style={{ 
            objectFit: 'contain',
            transition: 'transform 0.1s ease-out',
            ...getZoomStyles()
          }}
          onLoad={handleImageLoad}
          priority={true}
        />
      )}
    </div>
  );
}