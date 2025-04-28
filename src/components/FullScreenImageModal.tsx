// import { useRef, useEffect, useState } from 'react';
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';

// interface ImageData {
//   src: string;
//   alt?: string;
//   folder: string;
// }

// interface Mark {
//   id: string;
//   label: string;
// }

// interface FullScreenImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   images: ImageData[];
//   zoomPosition: { x: number, y: number } | null;
//   setZoomPosition: (position: { x: number, y: number } | null) => void;
//   zoomFactor?: number;
//   isZoomEnabled?: boolean;
//   // New props for evaluation features
//   marks: Mark[];
//   currentMark?: string;
//   onMarkSelect: (markId: string) => void;
//   currentTupleIndex: number;
//   totalTuples: number;
//   onPrevious: () => void;
//   onNext: () => void;
//   tupleFilename: string;
// }

// export default function FullScreenImageModal({ 
//   isOpen, 
//   onClose, 
//   images, 
//   zoomPosition, 
//   setZoomPosition, 
//   zoomFactor = 2.5,
//   isZoomEnabled = false,
//   marks,
//   currentMark,
//   onMarkSelect,
//   currentTupleIndex,
//   totalTuples,
//   onPrevious,
//   onNext,
//   tupleFilename
// }: FullScreenImageModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
//   const [allLoaded, setAllLoaded] = useState(false);
  
//   // Reset image loading state when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setImagesLoaded({});
//       setAllLoaded(false);
//     }
//   }, [isOpen]);
  
//   // Track when all images are loaded
//   useEffect(() => {
//     if (Object.keys(imagesLoaded).length === images.length && 
//         Object.values(imagesLoaded).every(loaded => loaded)) {
//       setAllLoaded(true);
//     }
//   }, [imagesLoaded, images.length]);
  
//   // Track individual image loading
//   const handleImageLoad = (index: number) => {
//     setImagesLoaded(prev => ({
//       ...prev,
//       [index]: true
//     }));
//   };
  
//   // Close the modal when Escape key is pressed
//   useEffect(() => {
//     const handleEscapeKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscapeKey);
//     return () => window.removeEventListener('keydown', handleEscapeKey);
//   }, [isOpen, onClose]);
  
//   // Handle global mouse move for zooming
//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isZoomEnabled || !modalRef.current) return;
    
//     const container = (e.target as Element).closest('.image-container');
//     if (!container) return;
    
//     const { left, top, width, height } = container.getBoundingClientRect();
    
//     // Calculate position as percentages (0-1)
//     const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
//     const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
//     setZoomPosition({ x, y });
//   };

//   // Calculate zoom styles
//   const getZoomStyles = () => {
//     if (!zoomPosition || !isZoomEnabled) {
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

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col"
//       ref={modalRef}
//     >
//       {/* Header with title, navigation, and close button */}
//       <div className="flex justify-between items-center p-4 text-white border-b border-gray-800">
//         <div className="flex items-center gap-4">
//           <h2 className="text-xl font-semibold">Image {currentTupleIndex + 1}/{totalTuples}: {tupleFilename}</h2>
          
//           <div className="flex gap-2 ml-4">
//             <Button
//               variant="outline"
//               size="sm" 
//               onClick={onPrevious}
//               disabled={currentTupleIndex <= 0}
//               className="text-white border-gray-600 hover:bg-gray-800"
//             >
//               <ChevronLeft className="h-4 w-4 mr-1" />
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onNext}
//               disabled={currentTupleIndex >= totalTuples - 1}
//               className="text-white border-gray-600 hover:bg-gray-800"
//             >
//               Next
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Button>
//           </div>
//         </div>
        
//         <button 
//           onClick={onClose}
//           className="text-white hover:text-gray-300 focus:outline-none p-2 rounded-full hover:bg-gray-800"
//           aria-label="Close"
//         >
//           <X size={24} />
//         </button>
//       </div>
      
//       {/* Main content with images */}
//       <div 
//         className="flex-1 flex justify-center items-stretch gap-4 p-4 overflow-auto"
//         onMouseMove={handleMouseMove}
//       >
//         {!allLoaded && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
//             <div className="text-white text-lg">Loading images...</div>
//           </div>
//         )}
        
//         {images.map((image, index) => (
//           <div 
//             key={index} 
//             className="image-container relative h-[75vh] flex-1 basis-0 min-w-[300px] max-w-[800px] border border-gray-700 rounded-md overflow-hidden"
//           >
//             <div className="relative w-full h-full">
//               {/* Hidden image preloader */}
//               <img 
//                 src={image.src}
//                 className="hidden"
//                 onLoad={() => handleImageLoad(index)}
//                 alt=""
//               />
              
//               {/* Visible image */}
//               <Image
//                 src={image.src}
//                 alt={image.alt || `Image ${index + 1}`}
//                 fill
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 style={{
//                   objectFit: 'contain',
//                   transition: 'transform 0.1s ease-out',
//                   ...getZoomStyles(),
//                   opacity: imagesLoaded[index] ? 1 : 0
//                 }}
//                 priority={true}
//                 loading="eager"
//                 unoptimized={true}
//               />
//             </div>
//             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center">
//               {image.folder}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Footer with quality marks and zoom controls */}
//       <div className="p-4 border-t border-gray-800 bg-black bg-opacity-80 text-white">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           {/* Quality marks */}
//           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//             <span className="self-center mr-2 text-sm">Select quality:</span>
//             {marks.map((mark) => (
//               <Button
//                 key={mark.id}
//                 variant={currentMark === mark.id ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => onMarkSelect(mark.id)}
//                 className={currentMark === mark.id 
//                   ? "min-w-20 bg-blue-600 hover:bg-blue-700" 
//                   : "min-w-20 text-white border-gray-600 hover:bg-gray-800"}
//               >
//                 {mark.label}
//               </Button>
//             ))}
//           </div>
          
//           {/* Zoom controls */}
//           <Button
//             variant="outline" 
//             size="sm"
//             onClick={() => setZoomPosition(null)}
//             className={`${isZoomEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
//           >
//             {isZoomEnabled ? 'Zoom Enabled' : 'Zoom Disabled'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useRef, useEffect, useState } from 'react';
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';
// import NextImage from 'next/image';
// import { Button } from '@/components/ui/button';

// interface ImageData {
//   src: string;
//   alt?: string;
//   folder: string;
// }

// interface Mark {
//   id: string;
//   label: string;
// }

// interface FullScreenImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   images: ImageData[];
//   zoomPosition: { x: number, y: number } | null;
//   setZoomPosition: (position: { x: number, y: number } | null) => void;
//   zoomFactor?: number;
//   isZoomEnabled?: boolean;
//   // New props for evaluation features
//   marks: Mark[];
//   currentMark?: string;
//   onMarkSelect: (markId: string) => void;
//   currentTupleIndex: number;
//   totalTuples: number;
//   onPrevious: () => void;
//   onNext: () => void;
//   tupleFilename: string;
// }

// export default function FullScreenImageModal({ 
//   isOpen, 
//   onClose, 
//   images, 
//   zoomPosition, 
//   setZoomPosition, 
//   zoomFactor = 2.5,
//   isZoomEnabled = false,
//   marks,
//   currentMark,
//   onMarkSelect,
//   currentTupleIndex,
//   totalTuples,
//   onPrevious,
//   onNext,
//   tupleFilename
// }: FullScreenImageModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState(true);
  
//   // Set loading state when modal opens or images change
//   useEffect(() => {
//     if (isOpen) {
//       setLoading(true);
      
//       // Set a timeout to assume images are loaded after a short delay
//       const timer = setTimeout(() => {
//         setLoading(false);
//       }, 1000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, images]);
  
//   // Close the modal when Escape key is pressed
//   useEffect(() => {
//     const handleEscapeKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscapeKey);
//     return () => window.removeEventListener('keydown', handleEscapeKey);
//   }, [isOpen, onClose]);
  
//   // Handle global mouse move for zooming
//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isZoomEnabled || !modalRef.current) return;
    
//     const container = (e.target as Element).closest('.image-container');
//     if (!container) return;
    
//     const { left, top, width, height } = container.getBoundingClientRect();
    
//     // Calculate position as percentages (0-1)
//     const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
//     const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
//     setZoomPosition({ x, y });
//   };

//   // Calculate zoom styles
//   const getZoomStyles = () => {
//     if (!zoomPosition || !isZoomEnabled) {
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

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col"
//       ref={modalRef}
//     >
//       {/* Header with title, navigation, and close button */}
//       <div className="flex justify-between items-center p-4 text-white border-b border-gray-800">
//         <div className="flex items-center gap-4">
//           <h2 className="text-xl font-semibold">Image {currentTupleIndex + 1}/{totalTuples}: {tupleFilename}</h2>
          
//           <div className="flex gap-2 ml-4">
//             <Button
//               variant="outline"
//               size="sm" 
//               onClick={onPrevious}
//               disabled={currentTupleIndex <= 0}
//               className="text-white border-gray-600 hover:bg-gray-800"
//             >
//               <ChevronLeft className="h-4 w-4 mr-1" />
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onNext}
//               disabled={currentTupleIndex >= totalTuples - 1}
//               className="text-white border-gray-600 hover:bg-gray-800"
//             >
//               Next
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Button>
//           </div>
//         </div>
        
//         <button 
//           onClick={onClose}
//           className="text-white hover:text-gray-300 focus:outline-none p-2 rounded-full hover:bg-gray-800"
//           aria-label="Close"
//         >
//           <X size={24} />
//         </button>
//       </div>
      
//       {/* Main content with images */}
//       <div 
//         className="flex-1 flex justify-center items-stretch gap-4 p-4 overflow-auto"
//         onMouseMove={handleMouseMove}
//       >
//         {loading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
//             <div className="text-white text-lg">Loading images...</div>
//           </div>
//         )}
        
//         {images.map((image, index) => (
//           <div 
//             key={index} 
//             className="image-container relative h-[75vh] flex-1 basis-0 min-w-[300px] max-w-[800px] border border-gray-700 rounded-md overflow-hidden"
//           >
//             <div className="relative w-full h-full">
//               <img
//                 src={image.src}
//                 alt={image.alt || `Image ${index + 1}`}
//                 className="object-contain w-full h-full"
//                 style={{
//                   transition: 'transform 0.1s ease-out',
//                   ...getZoomStyles()
//                 }}
//               />
//             </div>
//             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center">
//               {image.folder}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Footer with quality marks and zoom controls */}
//       <div className="p-4 border-t border-gray-800 bg-black bg-opacity-80 text-white">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           {/* Quality marks */}
//           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//             <span className="self-center mr-2 text-sm">Select quality:</span>
//             {marks.map((mark) => (
//               <Button
//                 key={mark.id}
//                 variant={currentMark === mark.id ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => onMarkSelect(mark.id)}
//                 className={currentMark === mark.id 
//                   ? "min-w-20 bg-blue-600 hover:bg-blue-700" 
//                   : "min-w-20 text-white border-gray-600 hover:bg-gray-800"}
//               >
//                 {mark.label}
//               </Button>
//             ))}
//           </div>
          
//           {/* Zoom controls */}
//           <Button
//             variant="outline" 
//             size="sm"
//             onClick={() => setZoomPosition(null)}
//             className={`${isZoomEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
//           >
//             {isZoomEnabled ? 'Zoom Enabled' : 'Zoom Disabled'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }