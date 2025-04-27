// // src/app/evaluation/page.tsx
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
//     goToNextTuple
//   } = useEvaluation();
  
//   const router = useRouter();
  
//   // State for the current tuple
//   const [currentTuple, setCurrentTuple] = useState(imageTuples[currentTupleIndex]);
  
//   // State for image URLs (simulate with placeholder images for now)
//   const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  
//   // Update current tuple when index changes
//   useEffect(() => {
//     if (imageTuples.length === 0) {
//       // No tuples available, redirect to home
//       router.push('/');
//       return;
//     }
    
//     setCurrentTuple(imageTuples[currentTupleIndex]);
    
//     // Generate placeholder image URLs for demonstration
//     const urls: Record<string, string> = {};
//     Object.keys(imageTuples[currentTupleIndex].paths).forEach((folder) => {
//       // In a real implementation, we'd get actual image URLs from the file system
//       // For demo purposes, we're using placeholder images
//       urls[folder] = `/api/placeholder/400/320?text=${folder}/${imageTuples[currentTupleIndex].filename}`;
//     });
    
//     setImageUrls(urls);
//   }, [currentTupleIndex, imageTuples, router]);
  
//   // Calculate progress
//   const progress = calculatePercentage(evaluationResults.length, imageTuples.length);
  
//   // Check if current tuple has been evaluated
//   const currentTupleEvaluated = evaluationResults.some(result => result.tupleId === currentTuple?.id);
  
//   // Handle mark selection
//   const handleMarkSelect = (markId: string) => {
//     if (currentTuple) {
//       assignMark(currentTuple.id, markId);
//     }
//   };
  
//   // Handle next tuple
//   const handleNext = () => {
//     goToNextTuple();
//   };
  
//   // Handle end evaluation
//   const handleEnd = () => {
//     endEvaluation();
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
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Object.entries(imageUrls).map(([folder, url]) => (
//                   <div key={folder} className="flex flex-col items-center">
//                     <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
//                       <Image 
//                         src={url}
//                         alt={`${folder} image`}
//                         fill
//                         style={{ objectFit: 'contain' }}
//                       />
//                     </div>
//                     <div className="mt-2 text-sm font-medium">
//                       {folder}
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
//                       variant="outline"
//                       onClick={() => handleMarkSelect(mark.id)}
//                       className="min-w-20"
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
//           <Button 
//             variant="outline"
//             onClick={handleNext}
//             disabled={currentTupleIndex >= imageTuples.length - 1}
//           >
//             Next
//           </Button>
//           <Button 
//             onClick={handleEnd}
//           >
//             End Evaluation
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
//2nd option work good
// src/app/evaluation/page.tsx
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
  
//   // State for image URLs
//   const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
//   const [loadingImages, setLoadingImages] = useState(false);
  
//   // Update current tuple when index changes
//   useEffect(() => {
//     if (imageTuples.length === 0) {
//       // No tuples available, redirect to home
//       router.push('/');
//       return;
//     }
    
//     setCurrentTuple(imageTuples[currentTupleIndex]);
    
//     // Load images for the current tuple
//     const loadImages = async () => {
//       setLoadingImages(true);
//       const urls: Record<string, string> = {};
      
//       // Load images from each folder
//       for (const folder of Object.keys(imageTuples[currentTupleIndex].paths)) {
//         try {
//           const url = await getImageUrl(imageTuples[currentTupleIndex], folder);
//           urls[folder] = url;
//         } catch (error) {
//           console.error(`Error loading image from ${folder}:`, error);
//           urls[folder] = `/api/placeholder/400/320?text=Error+loading+${folder}`;
//         }
//       }
      
//       setImageUrls(urls);
//       setLoadingImages(false);
//     };
    
//     loadImages();
//   }, [currentTupleIndex, imageTuples, router, getImageUrl]);
  
//   // Calculate progress
//   const progress = calculatePercentage(evaluationResults.length, imageTuples.length);
  
//   // Check if current tuple has been evaluated
//   const currentTupleEvaluated = currentTuple 
//     ? evaluationResults.some(result => result.tupleId === currentTuple.id)
//     : false;
  
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
  
//   // Handle navigation
//   const handleNext = () => {
//     goToNextTuple();
//   };
  
//   const handlePrevious = () => {
//     goToPreviousTuple();
//   };
  
//   // Handle end evaluation
//   const handleEnd = () => {
//     endEvaluation();
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
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {loadingImages ? (
//                   <div className="col-span-full flex justify-center items-center h-64">
//                     <p>Loading images...</p>
//                   </div>
//                 ) : (
//                   Object.entries(imageUrls).map(([folder, url]) => (
//                     <div key={folder} className="flex flex-col items-center">
//                       <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
//                         <Image 
//                           src={url}
//                           alt={`${folder} image`}
//                           fill
//                           style={{ objectFit: 'contain' }}
//                         />
//                       </div>
//                       <div className="mt-2 text-sm font-medium">
//                         {folder}
//                       </div>
//                     </div>
//                   ))
//                 )}
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
//               onClick={handlePrevious}
//               disabled={currentTupleIndex <= 0}
//               className="mr-2"
//             >
//               Previous
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={handleNext}
//               disabled={currentTupleIndex >= imageTuples.length - 1}
//             >
//               Next
//             </Button>
//           </div>
//           <Button 
//             onClick={handleEnd}
//           >
//             End Evaluation
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }



// src/app/evaluation/page.tsx
// 'use client';

// import { useEffect, useState, useCallback } from 'react';
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
  
//   // State for image URLs - now using an array of objects to maintain order
//   const [imageEntries, setImageEntries] = useState<{folder: string, url: string}[]>([]);
//   const [loadingImages, setLoadingImages] = useState(false);
//   const [loadingError, setLoadingError] = useState<string | null>(null);
  
//   // Load images function - defined as useCallback to avoid recreation
//   const loadImages = useCallback(async (tuple: any) => {
//     if (!tuple) return;
    
//     setLoadingImages(true);
//     setLoadingError(null);
//     setImageEntries([]); // Clear existing images first
    
//     const entries: {folder: string, url: string}[] = [];
//     let hasError = false;
    
//     // Process each folder one by one
//     for (const folder of Object.keys(tuple.paths)) {
//       try {
//         console.log(`Loading image for ${folder}...`);
//         const url = await getImageUrl(tuple, folder);
        
//         // Add to our entries array
//         entries.push({ folder, url });
        
//         // Update the state after each image is loaded
//         // This allows us to see images as they load
//         setImageEntries([...entries]);
//       } catch (error) {
//         console.error(`Error loading image from ${folder}:`, error);
//         entries.push({ 
//           folder, 
//           url: `/api/placeholder/400/320?text=Error+loading+${folder}` 
//         });
//         setImageEntries([...entries]);
//         hasError = true;
//       }
//     }
    
//     setLoadingImages(false);
    
//     if (hasError) {
//       setLoadingError("Some images could not be loaded properly. This might be due to permission issues or unsupported file formats.");
//     }
    
//     console.log(`Loaded ${entries.length} images for evaluation`);
//   }, [getImageUrl]);
  
//   // Update current tuple when index changes
//   useEffect(() => {
//     if (imageTuples.length === 0) {
//       // No tuples available, redirect to home
//       router.push('/');
//       return;
//     }
    
//     const tuple = imageTuples[currentTupleIndex];
//     setCurrentTuple(tuple);
    
//     // Load images for the current tuple
//     loadImages(tuple);
//   }, [currentTupleIndex, imageTuples, router, loadImages]);
  
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
  
//   // Handle navigation
//   const handleNext = () => {
//     goToNextTuple();
//   };
  
//   const handlePrevious = () => {
//     goToPreviousTuple();
//   };
  
//   // Handle end evaluation
//   const handleEnd = () => {
//     endEvaluation();
//   };
  
//   // Calculate grid columns based on number of images
//   const getGridClass = () => {
//     const folderCount = imageEntries.length;
    
//     // Always display in a row, but adjust size based on count
//     if (folderCount <= 2) {
//       return "grid-cols-1 md:grid-cols-2";
//     } else if (folderCount <= 3) {
//       return "grid-cols-1 md:grid-cols-3";
//     } else if (folderCount <= 4) {
//       return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
//     } else {
//       return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
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
//                 {loadingImages && imageEntries.length === 0 ? (
//                   <div className="col-span-full flex justify-center items-center h-64">
//                     <p>Loading images...</p>
//                   </div>
//                 ) : (
//                   imageEntries.map(({ folder, url }) => (
//                     <div key={folder} className="flex flex-col items-center">
//                       <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
//                         <Image 
//                           src={url}
//                           alt={`${folder} image`}
//                           fill
//                           style={{ objectFit: 'contain' }}
//                         />
//                       </div>
//                       <div className="mt-2 text-sm font-medium">
//                         {folder} {loadingImages && <span className="text-gray-400">(loading...)</span>}
//                       </div>
//                     </div>
//                   ))
//                 )}
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
//               onClick={handlePrevious}
//               disabled={currentTupleIndex <= 0}
//               className="mr-2"
//             >
//               Previous
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={handleNext}
//               disabled={currentTupleIndex >= imageTuples.length - 1}
//             >
//               Next
//             </Button>
//           </div>
//           <Button 
//             onClick={handleEnd}
//           >
//             End Evaluation
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }


// Replace the entire src/app/evaluation/page.tsx with this version
//works good

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




// Replace the entire src/app/evaluation/page.tsx with this version

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { useRouter } from 'next/navigation';
import { calculatePercentage } from '@/utils/statisticsUtils';
import Image from 'next/image';

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
  
  // State for image URLs - using an array to maintain order and ensure all images are shown
  const [folderImages, setFolderImages] = useState<{folder: string, url: string, loading: boolean, error: boolean}[]>([]);
  const [loadingAny, setLoadingAny] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
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
          <CardTitle>Evaluate Image Tuple {currentTupleIndex + 1}/{imageTuples.length}</CardTitle>
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
                    <div className="relative w-full h-64 border border-gray-200 rounded-md overflow-hidden">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <p>Loading...</p>
                        </div>
                      ) : (
                        <Image 
                          src={url}
                          alt={`${folder} image`}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </div>
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
    </div>
  );
}