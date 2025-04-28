//working version
// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { useEvaluation } from '@/contexts/EvaluationContext';
// import { useRouter } from 'next/navigation';
// import { calculatePercentage } from '@/utils/statisticsUtils';
// import Image from 'next/image';

// export default function EvaluationPage() {
//   const { 
//     imageTuples, 
//     currentTupleIndex, 
//     marks, 
//     assignMark, 
//     evaluationResults,
//     endEvaluation,
//     goToNextTuple,
//     goToPreviousTuple,
//     getImageUrl
//   } = useEvaluation();
  
//   const router = useRouter();
  
//   // State for the current tuple
//   const [currentTuple, setCurrentTuple] = useState(imageTuples[currentTupleIndex]);
  
//   // State for image URLs - using an array to maintain order and ensure all images are shown
//   const [folderImages, setFolderImages] = useState<{folder: string, url: string, loading: boolean, error: boolean}[]>([]);
//   const [loadingAny, setLoadingAny] = useState(false);
//   const [loadingError, setLoadingError] = useState<string | null>(null);
  
//   // Helper function to reset images when changing tuples
//   const resetImages = () => {
//     // Initialize with loading state for all folders
//     if (currentTuple) {
//       const initialFolderState = Object.keys(currentTuple.paths).map(folder => ({
//         folder,
//         url: '', // Empty URL while loading
//         loading: true,
//         error: false
//       }));
//       setFolderImages(initialFolderState);
//     } else {
//       setFolderImages([]);
//     }
//   };
  
//   // Update image loading state
//   const updateImageState = (folder: string, url: string, error: boolean = false) => {
//     setFolderImages(current => 
//       current.map(item => 
//         item.folder === folder 
//           ? { ...item, url, loading: false, error } 
//           : item
//       )
//     );
//   };
  
//   // Load all images for the current tuple
//   const loadImagesForTuple = async () => {
//     if (!currentTuple) return;
    
//     setLoadingAny(true);
//     setLoadingError(null);
//     resetImages(); // Initialize with loading state
    
//     let hasErrors = false;
    
//     // Process each folder sequentially to avoid race conditions
//     for (const folder of Object.keys(currentTuple.paths)) {
//       try {
//         console.log(`Loading image for ${folder}...`);
//         const url = await getImageUrl(currentTuple, folder);
//         updateImageState(folder, url);
//       } catch (error) {
//         console.error(`Failed to load image for ${folder}:`, error);
//         updateImageState(
//           folder, 
//           `/api/placeholder/400/320?text=Error+loading+${folder}`, 
//           true
//         );
//         hasErrors = true;
//       }
//     }
    
//     setLoadingAny(false);
    
//     if (hasErrors) {
//       setLoadingError("Some images could not be loaded. This might be due to permissions or unsupported formats.");
//     }
//   };
  
//   // Update current tuple when index changes
//   useEffect(() => {
//     if (imageTuples.length === 0) {
//       // No tuples available, redirect to home
//       router.push('/');
//       return;
//     }
    
//     const tuple = imageTuples[currentTupleIndex];
//     setCurrentTuple(tuple);
    
//     // Load images when tuple changes
//     loadImagesForTuple();
    
//     // Cleanup function to revoke object URLs when component unmounts or tuple changes
//     return () => {
//       folderImages.forEach(item => {
//         if (item.url && item.url.startsWith('blob:')) {
//           URL.revokeObjectURL(item.url);
//         }
//       });
//     };
//   }, [currentTupleIndex, imageTuples, router]);
  
//   // Calculate progress
//   const progress = calculatePercentage(evaluationResults.length, imageTuples.length);
  
//   // Get current mark for this tuple (if already evaluated)
//   const currentMark = currentTuple 
//     ? evaluationResults.find(result => result.tupleId === currentTuple.id)?.mark
//     : undefined;
  
//   // Handle mark selection
//   const handleMarkSelect = (markId: string) => {
//     if (currentTuple) {
//       assignMark(currentTuple.id, markId);
//     }
//   };
  
//   // Calculate grid columns based on number of images
//   const getGridClass = () => {
//     const folderCount = folderImages.length;
    
//     if (folderCount <= 2) {
//       return "grid-cols-1 md:grid-cols-2";
//     } else if (folderCount <= 3) {
//       return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
//     } else {
//       return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
//     }
//   };
  
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Evaluate Image Tuple {currentTupleIndex + 1}/{imageTuples.length}</CardTitle>
//           <div className="mt-2">
//             <Progress value={progress} className="h-2" />
//             <div className="text-sm text-gray-500 mt-1">
//               Progress: {evaluationResults.length}/{imageTuples.length} ({progress}%)
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {currentTuple && (
//             <>
//               <div className="text-sm font-medium mb-4">
//                 Filename: {currentTuple.filename}
//               </div>
              
//               {loadingError && (
//                 <div className="mb-4 p-3 text-sm rounded-md bg-yellow-50 text-yellow-600">
//                   {loadingError}
//                 </div>
//               )}
              
//               <div className={`grid ${getGridClass()} gap-4`}>
//                 {folderImages.map(({ folder, url, loading, error }) => (
//                   <div key={folder} className="flex flex-col items-center">
//                     <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
//                       {loading ? (
//                         <div className="flex items-center justify-center h-full">
//                           <p>Loading...</p>
//                         </div>
//                       ) : (
//                         <Image 
//                           src={url}
//                           alt={`${folder} image`}
//                           fill
//                           style={{ objectFit: 'contain' }}
//                         />
//                       )}
//                     </div>
//                     <div className="mt-2 text-sm font-medium">
//                       {folder} {error && <span className="text-red-500">(error)</span>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mt-8">
//                 <h3 className="text-md font-medium mb-2">Select quality mark:</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {marks.map((mark) => (
//                     <Button
//                       key={mark.id}
//                       variant={currentMark === mark.id ? "default" : "outline"}
//                       onClick={() => handleMarkSelect(mark.id)}
//                       className="min-w-20"
//                       disabled={loadingAny}
//                     >
//                       {mark.label}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <div>
//             <Button 
//               variant="outline"
//               onClick={goToPreviousTuple}
//               disabled={currentTupleIndex <= 0 || loadingAny}
//               className="mr-2"
//             >
//               Previous
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={goToNextTuple}
//               disabled={currentTupleIndex >= imageTuples.length - 1 || loadingAny}
//             >
//               Next
//             </Button>
//           </div>
//           <Button 
//             onClick={endEvaluation}
//             disabled={loadingAny}
//           >
//             End Evaluation
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { useRouter } from 'next/navigation';
import { calculatePercentage } from '@/utils/statisticsUtils';
import ZoomableImage from '@/components/ZoomableImage';
// import FullScreenImageModal from '@/components/FullScreenImageModal';
import { Maximize2, ZoomIn } from 'lucide-react';
import { image } from '@tensorflow/tfjs-core';

export default function EvaluationPage() {
  const { 
    imageTuples, 
    currentTupleIndex, 
    marks, 
    assignMark, 
    evaluationResults,
    endEvaluation,
    goToNextTuple,
    goToPreviousTuple,
    getImageUrl
  } = useEvaluation();
  
  const router = useRouter();
  
  // State for the current tuple
  const [currentTuple, setCurrentTuple] = useState(imageTuples[currentTupleIndex]);
  
  // State for image URLs
  const [folderImages, setFolderImages] = useState<{folder: string, url: string, loading: boolean, error: boolean}[]>([]);
  const [loadingAny, setLoadingAny] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // State for zoom functionality
  const [zoomPosition, setZoomPosition] = useState<{x: number, y: number} | null>(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  
  // State for full-screen modal
  const [_isModalOpen, setIsModalOpen] = useState(false);
  const [_fullscreenImages, setFullscreenImages] = useState<{src: string, alt: string, folder: string}[]>([]);
  
  // Helper function to reset images when changing tuples
  const resetImages = () => {
    // Initialize with loading state for all folders
    if (currentTuple) {
      const initialFolderState = Object.keys(currentTuple.paths).map(folder => ({
        folder,
        url: '', // Empty URL while loading
        loading: true,
        error: false
      }));
      setFolderImages(initialFolderState);
    } else {
      setFolderImages([]);
    }
  };
  
  // Update image loading state
  const updateImageState = (folder: string, url: string, error: boolean = false) => {
    setFolderImages(current => 
      current.map(item => 
        item.folder === folder 
          ? { ...item, url, loading: false, error } 
          : item
      )
    );
  };
  
  // Load all images for the current tuple
  const loadImagesForTuple = async () => {
    if (!currentTuple) return;
    
    setLoadingAny(true);
    setLoadingError(null);
    resetImages(); // Initialize with loading state
    
    let hasErrors = false;
    
    // Process each folder sequentially to avoid race conditions
    for (const folder of Object.keys(currentTuple.paths)) {
      try {
        console.log(`Loading image for ${folder}...`);
        const url = await getImageUrl(currentTuple, folder);
        updateImageState(folder, url);
      } catch (error) {
        console.error(`Failed to load image for ${folder}:`, error);
        updateImageState(
          folder, 
          `/api/placeholder/400/320?text=Error+loading+${folder}`, 
          true
        );
        hasErrors = true;
      }
    }
    
    setLoadingAny(false);
    
    if (hasErrors) {
      setLoadingError("Some images could not be loaded. This might be due to permissions or unsupported formats.");
    }
  };
  
  // Update current tuple when index changes
  useEffect(() => {
    if (imageTuples.length === 0) {
      // No tuples available, redirect to home
      router.push('/');
      return;
    }
    
    const tuple = imageTuples[currentTupleIndex];
    setCurrentTuple(tuple);
    
    // Reset zoom when changing tuples
    setZoomPosition(null);
    
    // Load images when tuple changes
    loadImagesForTuple();
    
    // Cleanup function to revoke object URLs when component unmounts or tuple changes
    return () => {
      folderImages.forEach(item => {
        if (item.url && item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [currentTupleIndex, imageTuples, router]);
  
  // Calculate progress
  const progress = calculatePercentage(evaluationResults.length, imageTuples.length);
  
  // Get current mark for this tuple (if already evaluated)
  const currentMark = currentTuple 
    ? evaluationResults.find(result => result.tupleId === currentTuple.id)?.mark
    : undefined;
  
  // Handle mark selection
  const handleMarkSelect = (markId: string) => {
    if (currentTuple) {
      assignMark(currentTuple.id, markId);
    }
  };
  
  // Toggle zoom functionality
  const toggleZoom = () => {
    setIsZoomEnabled(prev => !prev);
    if (isZoomEnabled) {
      setZoomPosition(null);
    }
  };
  
  // Handle image click to open in full screen
  const handleImageClick = () => {
    const allImages = folderImages
      .filter(item => !item.loading && !item.error)
      .map(item => ({
        src: item.url,
        alt: `${item.folder} - ${currentTuple?.filename}`,
        folder: item.folder
      }));
    
    setFullscreenImages(allImages);
    setIsModalOpen(true);
  };
  
  // Calculate grid columns based on number of images
  const getGridClass = () => {
    const folderCount = folderImages.length;
    
    if (folderCount <= 2) {
      return "grid-cols-1 md:grid-cols-2";
    } else if (folderCount <= 3) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    } else {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Evaluate Image Tuple {currentTupleIndex + 1}/{imageTuples.length}</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleZoom}
                className={isZoomEnabled ? 'bg-blue-100' : ''}
              >
                <ZoomIn className="mr-1 h-4 w-4" />
                {isZoomEnabled ? 'Disable Zoom' : 'Enable Zoom'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const allImages = folderImages
                    .filter(item => !item.loading && !item.error)
                    .map(item => ({
                      src: item.url,
                      alt: `${item.folder} - ${currentTuple?.filename}`,
                      folder: item.folder
                    }));
                  
                  setFullscreenImages(allImages);
                  setIsModalOpen(true);
                }}
                disabled={loadingAny}
              >
                <Maximize2 className="mr-1 h-4 w-4" />
                Full Screen
              </Button>
            </div>
          </CardTitle>
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-gray-500 mt-1">
              Progress: {evaluationResults.length}/{imageTuples.length} ({progress}%)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentTuple && (
            <>
              <div className="text-sm font-medium mb-4">
                Filename: {currentTuple.filename}
              </div>
              
              {loadingError && (
                <div className="mb-4 p-3 text-sm rounded-md bg-yellow-50 text-yellow-600">
                  {loadingError}
                </div>
              )}
              
              <div className={`grid ${getGridClass()} gap-4`}>
                {folderImages.map(({ folder, url, loading, error }) => (
                  <div key={folder} className="flex flex-col items-center">
                    <ZoomableImage 
                      src={url}
                      alt={`${folder} image`}
                      folder={folder}
                      loading={loading}
                      error={error}
                      zoomFactor={2.5}
                      zoomPosition={zoomPosition}
                      setZoomPosition={setZoomPosition}
                      isZoomEnabled={isZoomEnabled}
                      onImageClick={handleImageClick}
                    />
                    <div className="mt-2 text-sm font-medium">
                      {folder} {error && <span className="text-red-500">(error)</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-md font-medium mb-2">Select quality mark:</h3>
                <div className="flex flex-wrap gap-2">
                  {marks.map((mark) => (
                    <Button
                      key={mark.id}
                      variant={currentMark === mark.id ? "default" : "outline"}
                      onClick={() => handleMarkSelect(mark.id)}
                      className="min-w-20"
                      disabled={loadingAny}
                    >
                      {mark.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button 
              variant="outline"
              onClick={goToPreviousTuple}
              disabled={currentTupleIndex <= 0 || loadingAny}
              className="mr-2"
            >
              Previous
            </Button>
            <Button 
              variant="outline"
              onClick={goToNextTuple}
              disabled={currentTupleIndex >= imageTuples.length - 1 || loadingAny}
            >
              Next
            </Button>
          </div>
          <Button 
            onClick={endEvaluation}
            disabled={loadingAny}
          >
            End Evaluation
          </Button>
        </CardFooter>
      </Card>
      
      {/* Full-screen modal */}
      {/* <FullScreenImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={fullscreenImages}
        zoomPosition={zoomPosition}
        setZoomPosition={setZoomPosition}
        zoomFactor={2.5}
        isZoomEnabled={isZoomEnabled}
      /> */}
    </div>
  );
}