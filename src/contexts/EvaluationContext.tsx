// // src/contexts/EvaluationContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { FolderStructure, Mark, ImageTuple, EvaluationResult, EvaluationStats } from '@/types';
// import { useRouter } from 'next/navigation';

// interface EvaluationContextType {
//   // Folder structure
//   folderStructure: FolderStructure;
//   setRootFolder: (structure: FolderStructure) => void;
//   toggleFolderSelection: (folderName: string) => void;
  
//   // Marks
//   marks: Mark[];
//   addMark: (label: string) => void;
//   removeMark: (id: string) => void;
  
//   // Image tuples
//   imageTuples: ImageTuple[];
//   currentTupleIndex: number;
//   setImageTuples: (tuples: ImageTuple[]) => void;
//   goToNextTuple: () => void;
//   goToPreviousTuple: () => void;
  
//   // Evaluation
//   evaluationResults: EvaluationResult[];
//   assignMark: (tupleId: string, markId: string) => void;
  
//   // Image loading
//   getImageUrl: (tuple: ImageTuple, folderName: string) => Promise<string>;
  
//   // Statistics
//   getStatistics: () => EvaluationStats;
  
//   // Navigation
//   startEvaluation: () => void;
//   endEvaluation: () => void;
//   resetEvaluation: () => void;
// }

// const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

// export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const router = useRouter();
  
//   // Folder structure state
//   const [folderStructure, setFolderStructure] = useState<FolderStructure>({
//     root: '',
//     necessaryFolders: {
//       originals: false,
//       target: false,
//     },
//     optionalFolders: {},
//     selectedFolders: [],
//   });
  
//   // Marks state
//   const [marks, setMarks] = useState<Mark[]>([
//     // Default marks
//     { id: 'mark-1', label: 'Excellent' },
//     { id: 'mark-2', label: 'Good' },
//     { id: 'mark-3', label: 'Fair' },
//     { id: 'mark-4', label: 'Poor' },
//   ]);
  
//   // Image tuples state
//   const [imageTuples, setImageTuples] = useState<ImageTuple[]>([]);
//   const [currentTupleIndex, setCurrentTupleIndex] = useState(0);
  
//   // Evaluation results state
//   const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  
//   // Image URL cache
//   const [imageUrlCache, setImageUrlCache] = useState<Record<string, string>>({});
  
//   // Set root folder
//   const setRootFolder = (structure: FolderStructure) => {
//     setFolderStructure(structure);
//   };
  
//   // Toggle folder selection
//   const toggleFolderSelection = (folderName: string) => {
//     const isSelected = folderStructure.selectedFolders.includes(folderName);
//     const newSelectedFolders = isSelected
//       ? folderStructure.selectedFolders.filter(name => name !== folderName)
//       : [...folderStructure.selectedFolders, folderName];
    
//     setFolderStructure({
//       ...folderStructure,
//       selectedFolders: newSelectedFolders,
//     });
//   };
  
//   // Add a new mark
//   const addMark = (label: string) => {
//     if (!label.trim()) return;
    
//     const newMark: Mark = {
//       id: `mark-${Date.now()}`,
//       label: label.trim(),
//     };
    
//     setMarks([...marks, newMark]);
//   };
  
//   // Remove a mark
//   const removeMark = (id: string) => {
//     setMarks(marks.filter(mark => mark.id !== id));
//   };
  
//   // Go to next tuple
//   const goToNextTuple = () => {
//     if (currentTupleIndex < imageTuples.length - 1) {
//       setCurrentTupleIndex(currentTupleIndex + 1);
//     }
//   };
  
//   // Go to previous tuple
//   const goToPreviousTuple = () => {
//     if (currentTupleIndex > 0) {
//       setCurrentTupleIndex(currentTupleIndex - 1);
//     }
//   };
  
//   // Assign mark to current tuple
//   const assignMark = (tupleId: string, markId: string) => {
//     const existingResultIndex = evaluationResults.findIndex(result => result.tupleId === tupleId);
    
//     if (existingResultIndex >= 0) {
//       // Update existing result
//       const newResults = [...evaluationResults];
//       newResults[existingResultIndex] = { tupleId, mark: markId };
//       setEvaluationResults(newResults);
//     } else {
//       // Add new result
//       setEvaluationResults([...evaluationResults, { tupleId, mark: markId }]);
//     }
    
//     // Automatically go to next tuple if current one hasn't been evaluated before
//     if (existingResultIndex === -1 && currentTupleIndex < imageTuples.length - 1) {
//       goToNextTuple();
//     }
//   };
  
//   // Get evaluation statistics
//   const getStatistics = (): EvaluationStats => {
//     const total = imageTuples.length;
//     const evaluated = evaluationResults.length;
    
//     // Generate mark distribution
//     const markDistribution: Record<string, number> = {};
//     marks.forEach(mark => {
//       markDistribution[mark.id] = 0;
//     });
    
//     evaluationResults.forEach(result => {
//       if (markDistribution[result.mark] !== undefined) {
//         markDistribution[result.mark]++;
//       }
//     });
    
//     return {
//       total,
//       evaluated,
//       markDistribution,
//     };
//   };
  
//   // Get image URL
//   const getImageUrl = async (tuple: ImageTuple, folderName: string): Promise<string> => {
//     const cacheKey = `${tuple.id}-${folderName}`;
    
//     // Return from cache if available
//     if (imageUrlCache[cacheKey]) {
//       return imageUrlCache[cacheKey];
//     }
    
//     try {
//       // Extract file path
//       const path = tuple.paths[folderName];
//       if (!path) throw new Error(`Path not found for ${folderName}`);
      
//       // Get directory handle
//       const dirHandle = tuple.directoryHandle;
//       if (!dirHandle) throw new Error('Directory handle not available');
      
//       // Get subdirectory handle
//       const folderHandle = await dirHandle.getDirectoryHandle(folderName);
      
//       // Get file handle
//       const fileName = path.split('/').pop() || '';
//       const fileHandle = await folderHandle.getFileHandle(fileName);
      
//       // Get file object
//       const file = await fileHandle.getFile();
      
//       // Create object URL
//       const url = URL.createObjectURL(file);
      
//       // Cache URL
//       setImageUrlCache(prev => ({
//         ...prev,
//         [cacheKey]: url
//       }));
      
//       return url;
//     } catch (error) {
//       console.error(`Error loading image from ${folderName}:`, error);
//       // Return placeholder image on error
//       return `/api/placeholder/400/320?text=Error+loading+${folderName}`;
//     }
//   };
  
//   // Navigation functions
//   const startEvaluation = () => {
//     if (folderStructure.selectedFolders.length < 2 || marks.length === 0) {
//       alert('You need to select at least 2 folders and add at least one mark');
//       return;
//     }
    
//     router.push('/evaluation');
//   };
  
//   const endEvaluation = () => {
//     // Clean up object URLs to prevent memory leaks
//     Object.values(imageUrlCache).forEach(url => {
//       URL.revokeObjectURL(url);
//     });
    
//     router.push('/statistics');
//   };
  
//   const resetEvaluation = () => {
//     // Clean up object URLs to prevent memory leaks
//     Object.values(imageUrlCache).forEach(url => {
//       URL.revokeObjectURL(url);
//     });
    
//     setFolderStructure({
//       root: '',
//       necessaryFolders: {
//         originals: false,
//         target: false,
//       },
//       optionalFolders: {},
//       selectedFolders: [],
//     });
//     setImageTuples([]);
//     setCurrentTupleIndex(0);
//     setEvaluationResults([]);
//     setImageUrlCache({});
//     router.push('/');
//   };
  
//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       // Clean up object URLs to prevent memory leaks
//       Object.values(imageUrlCache).forEach(url => {
//         URL.revokeObjectURL(url);
//       });
//     };
//   }, [imageUrlCache]);
  
//   const value: EvaluationContextType = {
//     folderStructure,
//     setRootFolder,
//     toggleFolderSelection,
//     marks,
//     addMark,
//     removeMark,
//     imageTuples,
//     currentTupleIndex,
//     setImageTuples,
//     goToNextTuple,
//     goToPreviousTuple,
//     evaluationResults,
//     assignMark,
//     getImageUrl,
//     getStatistics,
//     startEvaluation,
//     endEvaluation,
//     resetEvaluation,
//   };
  
//   return (
//     <EvaluationContext.Provider value={value}>
//       {children}
//     </EvaluationContext.Provider>
//   );
// };

// export const useEvaluation = () => {
//   const context = useContext(EvaluationContext);
//   if (context === undefined) {
//     throw new Error('useEvaluation must be used within an EvaluationProvider');
//   }
//   return context;
// };


// src/contexts/EvaluationContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { FolderStructure, Mark, ImageTuple, EvaluationResult, EvaluationStats } from '@/types';
// import { useRouter } from 'next/navigation';

// interface EvaluationContextType {
//   // Folder structure
//   folderStructure: FolderStructure;
//   setRootFolder: (structure: FolderStructure) => void;
//   toggleFolderSelection: (folderName: string) => void;
  
//   // Marks
//   marks: Mark[];
//   addMark: (label: string) => void;
//   removeMark: (id: string) => void;
  
//   // Image tuples
//   imageTuples: ImageTuple[];
//   currentTupleIndex: number;
//   setImageTuples: (tuples: ImageTuple[]) => void;
//   goToNextTuple: () => void;
//   goToPreviousTuple: () => void;
  
//   // Evaluation
//   evaluationResults: EvaluationResult[];
//   assignMark: (tupleId: string, markId: string) => void;
  
//   // Image loading
//   getImageUrl: (tuple: ImageTuple, folderName: string) => Promise<string>;
  
//   // Statistics
//   getStatistics: () => EvaluationStats;
  
//   // Navigation
//   startEvaluation: () => void;
//   endEvaluation: () => void;
//   resetEvaluation: () => void;
// }
// Update your EvaluationContextType interface in EvaluationContext.tsx

// interface EvaluationContextType {
//   // ... keep all your existing properties
  
//   // Folder structure
//   folderStructure: FolderStructure;
//   setRootFolder: (structure: FolderStructure) => void;
//   toggleFolderSelection: (folderName: string) => void;
  
//   // Marks
//   marks: Mark[];
//   addMark: (label: string) => void;
//   removeMark: (id: string) => void;
  
//   // Image tuples
//   imageTuples: ImageTuple[];
//   currentTupleIndex: number;
//   setImageTuples: (tuples: ImageTuple[]) => void;
//   goToNextTuple: () => void;
//   goToPreviousTuple: () => void;
  
//   // Evaluation
//   evaluationResults: EvaluationResult[];
//   assignMark: (tupleId: string, markId: string) => void;
  
//   // Image loading
//   getImageUrl: (tuple: ImageTuple, folderName: string) => Promise<string>;
  
//   // Statistics
//   getStatistics: () => EvaluationStats;
  
//   // Navigation
//   startEvaluation: () => void;
//   endEvaluation: () => void;
//   resetEvaluation: () => void;
  
//   // Face detection and zooming - add these new properties
//   enableFaceZoom: boolean;
//   setEnableFaceZoom: (enabled: boolean) => void;
//   faceZoomRegion: { x: number; y: number; width: number; height: number } | null;
//   detectFacesInCurrentTuple: (imageElements: HTMLImageElement[]) => Promise<{ x: number; y: number; width: number; height: number } | null>;
//   isDetectingFaces: boolean;
// }
// const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

// export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const router = useRouter();
  
//   // Folder structure state
//   const [folderStructure, setFolderStructure] = useState<FolderStructure>({
//     root: '',
//     necessaryFolders: {
//       originals: false,
//       target: false,
//     },
//     optionalFolders: {},
//     selectedFolders: [],
//   });
  
//   // Marks state
//   const [marks, setMarks] = useState<Mark[]>([
//     // Default marks
//     { id: 'mark-1', label: 'Excellent' },
//     { id: 'mark-2', label: 'Good' },
//     { id: 'mark-3', label: 'Fair' },
//     { id: 'mark-4', label: 'Poor' },
//   ]);
  
//   // Image tuples state
//   const [imageTuples, setImageTuples] = useState<ImageTuple[]>([]);
//   const [currentTupleIndex, setCurrentTupleIndex] = useState(0);
  
//   // Evaluation results state
//   const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  
//   // Image URL cache
//   const [imageUrlCache, setImageUrlCache] = useState<Record<string, string>>({});
  
//   // Set root folder
//   const setRootFolder = (structure: FolderStructure) => {
//     setFolderStructure(structure);
//   };

  
//   // Toggle folder selection
//   const toggleFolderSelection = (folderName: string) => {
//     const isSelected = folderStructure.selectedFolders.includes(folderName);
//     const newSelectedFolders = isSelected
//       ? folderStructure.selectedFolders.filter(name => name !== folderName)
//       : [...folderStructure.selectedFolders, folderName];
    
//     setFolderStructure({
//       ...folderStructure,
//       selectedFolders: newSelectedFolders,
//     });
//   };
  
//   // Add a new mark
//   const addMark = (label: string) => {
//     if (!label.trim()) return;
    
//     const newMark: Mark = {
//       id: `mark-${Date.now()}`,
//       label: label.trim(),
//     };
    
//     setMarks([...marks, newMark]);
//   };
  
//   // Remove a mark
//   const removeMark = (id: string) => {
//     setMarks(marks.filter(mark => mark.id !== id));
//   };
//   // Add these properties and functions to your existing EvaluationContext.tsx file

//   // New state properties to add to EvaluationProvider
//   const [enableFaceZoom, setEnableFaceZoom] = useState<boolean>(false);
//   const [faceZoomRegion, setFaceZoomRegion] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
//   const [isDetectingFaces, setIsDetectingFaces] = useState<boolean>(false);

//   // Add this function to detect faces in the current tuple
//   const detectFacesInCurrentTuple = async (imageElements: HTMLImageElement[]) => {
//     try {
//       if (!currentTuple || imageElements.length === 0) {
//         return null;
//       }

//       setIsDetectingFaces(true);
      
//       // Import the face detection service only when needed
//       const faceDetectionService = (await import('@/services/FaceDetectionService')).default;
      
//       // Get image dimensions
//       const imageWidths = imageElements.map(img => img.naturalWidth);
//       const imageHeights = imageElements.map(img => img.naturalHeight);
      
//       // Detect faces in all images
//       const facePromises = imageElements.map(img => faceDetectionService.detectFaces(img));
//       const allFaceResults = await Promise.all(facePromises);
      
//       // Get the first face from each image (we only need one face per image)
//       const faceResults = allFaceResults.map(results => results[0]);
      
//       // Calculate a common zoom region
//       const zoomRegion = faceDetectionService.calculateCommonZoomRegion(
//         faceResults.filter(Boolean),
//         imageWidths,
//         imageHeights,
//         0.5 // Add 50% padding around faces
//       );
      
//       setFaceZoomRegion(zoomRegion);
//       setIsDetectingFaces(false);
      
//       return zoomRegion;
//     } catch (error) {
//       console.error('Error detecting faces:', error);
//       setIsDetectingFaces(false);
//       return null;
//     }
//   };

//   // Toggle face zoom feature
//   const toggleFaceZoom = (enabled: boolean) => {
//     setEnableFaceZoom(enabled);
    
//     if (!enabled) {
//       // Reset zoom region when disabling
//       setFaceZoomRegion(null);
//     }
//   };

//   // Add these to the value object
//   const faceDetectionValue = {
//     enableFaceZoom,
//     setEnableFaceZoom: toggleFaceZoom,
//     faceZoomRegion,
//     detectFacesInCurrentTuple,
//     isDetectingFaces
//   };

//   // Go to next tuple
//   const goToNextTuple = () => {
//     if (currentTupleIndex < imageTuples.length - 1) {
//       setCurrentTupleIndex(currentTupleIndex + 1);
//     }
//   };
  
//   // Go to previous tuple
//   const goToPreviousTuple = () => {
//     if (currentTupleIndex > 0) {
//       setCurrentTupleIndex(currentTupleIndex - 1);
//     }
//   };
  
//   // Assign mark to current tuple
//   const assignMark = (tupleId: string, markId: string) => {
//     const existingResultIndex = evaluationResults.findIndex(result => result.tupleId === tupleId);
    
//     if (existingResultIndex >= 0) {
//       // Update existing result
//       const newResults = [...evaluationResults];
//       newResults[existingResultIndex] = { tupleId, mark: markId };
//       setEvaluationResults(newResults);
//     } else {
//       // Add new result
//       setEvaluationResults([...evaluationResults, { tupleId, mark: markId }]);
//     }
    
//     // Automatically go to next tuple if current one hasn't been evaluated before
//     if (existingResultIndex === -1 && currentTupleIndex < imageTuples.length - 1) {
//       goToNextTuple();
//     }
//   };
  
//   // Get evaluation statistics
//   const getStatistics = (): EvaluationStats => {
//     const total = imageTuples.length;
//     const evaluated = evaluationResults.length;
    
//     // Generate mark distribution
//     const markDistribution: Record<string, number> = {};
//     marks.forEach(mark => {
//       markDistribution[mark.id] = 0;
//     });
    
//     evaluationResults.forEach(result => {
//       if (markDistribution[result.mark] !== undefined) {
//         markDistribution[result.mark]++;
//       }
//     });
    
//     return {
//       total,
//       evaluated,
//       markDistribution,
//     };
//   };
  
//   // Get image URL
//   // Get image URL
//   // Insert this corrected function in EvaluationContext.tsx

// // Get image URL
// const getImageUrl = async (tuple: ImageTuple, folderName: string): Promise<string> => {
//   const cacheKey = `${tuple.id}-${folderName}`;
  
//   // Return from cache if available
//   if (imageUrlCache[cacheKey]) {
//     console.log(`Using cached URL for ${folderName}/${tuple.filename}`);
//     return imageUrlCache[cacheKey];
//   }
  
//   try {
//     console.log(`Loading image from ${folderName}/${tuple.filename}`);
    
//     // Get directory handle
//     const rootDirHandle = tuple.directoryHandle;
//     if (!rootDirHandle) throw new Error('Directory handle not available');
    
//     // Get subdirectory handle - THIS IS THE CRITICAL PART
//     console.log(`Getting folder handle for ${folderName}`);
//     let folderHandle;
//     try {
//       folderHandle = await rootDirHandle.getDirectoryHandle(folderName);
//     } catch (error) {
//       console.error(`Failed to get directory handle for ${folderName}:`, error);
//       throw new Error(`Folder ${folderName} not found or not accessible`);
//     }
    
//     // Get file handle - use the filename directly
//     console.log(`Getting file handle for ${tuple.filename}`);
//     let fileHandle;
//     try {
//       fileHandle = await folderHandle.getFileHandle(tuple.filename);
//     } catch (error) {
//       console.error(`Failed to get file handle for ${tuple.filename}:`, error);
//       throw new Error(`File ${tuple.filename} not found in ${folderName}`);
//     }
    
//     // Get file object
//     console.log(`Getting file object`);
//     const file = await fileHandle.getFile();
    
//     // Create object URL
//     console.log(`Creating object URL for ${file.name} (${file.size} bytes)`);
//     const url = URL.createObjectURL(file);
//     console.log(`URL created: ${url}`);
    
//     // Cache URL
//     setImageUrlCache(prev => {
//       const newCache = {
//         ...prev,
//         [cacheKey]: url
//       };
//       console.log(`Updated cache for ${cacheKey}`);
//       return newCache;
//     });
    
//     return url;
//   } catch (error) {
//     console.error(`Error loading image from ${folderName}/${tuple.filename}:`, error);
//     throw error;
//   }
// };
  
//   // Navigation functions
//   const startEvaluation = () => {
//     if (folderStructure.selectedFolders.length < 2 || marks.length === 0) {
//       alert('You need to select at least 2 folders and add at least one mark');
//       return;
//     }
    
//     router.push('/evaluation');
//   };
  
//   const endEvaluation = () => {
//     // Clean up object URLs to prevent memory leaks
//     Object.values(imageUrlCache).forEach(url => {
//       URL.revokeObjectURL(url);
//     });
    
//     router.push('/statistics');
//   };
  
//   const resetEvaluation = () => {
//     // Clean up object URLs to prevent memory leaks
//     Object.values(imageUrlCache).forEach(url => {
//       URL.revokeObjectURL(url);
//     });
    
//     setFolderStructure({
//       root: '',
//       necessaryFolders: {
//         originals: false,
//         target: false,
//       },
//       optionalFolders: {},
//       selectedFolders: [],
//     });
//     setImageTuples([]);
//     setCurrentTupleIndex(0);
//     setEvaluationResults([]);
//     setImageUrlCache({});
//     router.push('/');
//   };
  
//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       // Clean up object URLs to prevent memory leaks
//       Object.values(imageUrlCache).forEach(url => {
//         URL.revokeObjectURL(url);
//       });
//     };
//   }, [imageUrlCache]);
  
//   const value: EvaluationContextType = {
//     folderStructure,
//     setRootFolder,
//     toggleFolderSelection,
//     marks,
//     addMark,
//     removeMark,
//     imageTuples,
//     currentTupleIndex,
//     setImageTuples,
//     goToNextTuple,
//     goToPreviousTuple,
//     evaluationResults,
//     ...faceDetectionValue,
//     assignMark,
//     getImageUrl,
//     getStatistics,
//     startEvaluation,
//     endEvaluation,
//     resetEvaluation,
//   };
  
//   return (
//     <EvaluationContext.Provider value={value}>
//       {children}
//     </EvaluationContext.Provider>
//   );
// };

// export const useEvaluation = () => {
//   const context = useContext(EvaluationContext);
//   if (context === undefined) {
//     throw new Error('useEvaluation must be used within an EvaluationProvider');
//   }
//   return context;
// };



// // src/contexts/EvaluationContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { FolderStructure, Mark, ImageTuple, EvaluationResult, EvaluationStats } from '@/types';
// import { useRouter } from 'next/navigation';
// import { FaceRegion } from '@/services/mediapipeFaceDetectionService';

// interface EvaluationContextType {
//   // Folder structure
//   folderStructure: FolderStructure;
//   // setRootFolder: (path: string) => void;
//   setRootFolder: (structure: FolderStructure) => void;
//   toggleFolderSelection: (folderName: string) => void;
  
//   // Marks
//   marks: Mark[];
//   addMark: (label: string) => void;
//   removeMark: (id: string) => void;
  
//   // Image tuples
//   imageTuples: ImageTuple[];
//   currentTupleIndex: number;
//   setImageTuples: (tuples: ImageTuple[]) => void;
//   goToNextTuple: () => void;
  
//   // Evaluation
//   evaluationResults: EvaluationResult[];
//   assignMark: (tupleId: string, markId: string) => void;
  
//   // Statistics
//   getStatistics: () => EvaluationStats;
  
//   // Navigation
//   startEvaluation: () => void;
//   endEvaluation: () => void;
//   resetEvaluation: () => void;
// }

// const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

// export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const router = useRouter();
  
//   // Folder structure state
//   const [folderStructure, setFolderStructure] = useState<FolderStructure>({
//     root: '',
//     necessaryFolders: {
//       originals: false,
//       target: false,
//     },
//     optionalFolders: {},
//     selectedFolders: [],
//   });
  
//   // Marks state
//   const [marks, setMarks] = useState<Mark[]>([]);
  
//   // Image tuples state
//   const [imageTuples, setImageTuples] = useState<ImageTuple[]>([]);
//   const [currentTupleIndex, setCurrentTupleIndex] = useState(0);
  
//   // Evaluation results state
//   const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  
//   // Set root folder and scan for necessary/optional folders
//   // const setRootFolder = (path: string) => {
//   //   // In a real implementation, we would scan the file system
//   //   // For now, we'll just update the state with the path
//   //   setFolderStructure({
//   //     ...folderStructure,
//   //     root: path,
//   //     necessaryFolders: {
//   //       originals: true, // We're assuming these folders exist for demo
//   //       target: true,
//   //     },
//   //     optionalFolders: {}, // We'll populate this when integrating file system access
//   //     selectedFolders: ['originals', 'target'], // Default selection
//   //   });
//   // };
//   const setRootFolder = (structure: FolderStructure) => {
//     setFolderStructure(structure);
//   };
  
//   // Toggle folder selection
//   const toggleFolderSelection = (folderName: string) => {
//     const isSelected = folderStructure.selectedFolders.includes(folderName);
//     const newSelectedFolders = isSelected
//       ? folderStructure.selectedFolders.filter(name => name !== folderName)
//       : [...folderStructure.selectedFolders, folderName];
    
//     setFolderStructure({
//       ...folderStructure,
//       selectedFolders: newSelectedFolders,
//     });
//   };
  
//   // Add a new mark
//   const addMark = (label: string) => {
//     if (!label.trim()) return;
    
//     const newMark: Mark = {
//       id: `mark-${Date.now()}`,
//       label: label.trim(),
//     };
    
//     setMarks([...marks, newMark]);
//   };
  
//   // Go to next tuple
//   const goToNextTuple = () => {
//     if (currentTupleIndex < imageTuples.length - 1) {
//       setCurrentTupleIndex(currentTupleIndex + 1);
//     }
//   };
  
//   // Assign mark to tuple
//   const assignMark = (tupleId: string, markId: string) => {
//     const existingResultIndex = evaluationResults.findIndex(result => result.tupleId === tupleId);
    
//     if (existingResultIndex >= 0) {
//       // Update existing result
//       const newResults = [...evaluationResults];
//       newResults[existingResultIndex] = { 
//         tupleId, 
//         mark: markId,
//         faceDetection: {
//           hasFaces: true, // This would be populated based on face detection results
//           faceCount: 1    // This would be populated based on face detection results
//         }
//       };
//       setEvaluationResults(newResults);
//     } else {
//       // Add new result
//       setEvaluationResults([
//         ...evaluationResults, 
//         { 
//           tupleId, 
//           mark: markId,
//           faceDetection: {
//             hasFaces: true, // This would be populated based on face detection results
//             faceCount: 1    // This would be populated based on face detection results
//           }
//         }
//       ]);
//     }
    
//     // Automatically go to next tuple
//     goToNextTuple();
//   };
//   const removeMark = (id: string) => {
//         setMarks(marks.filter(mark => mark.id !== id));
//       };
  
//   // Get evaluation statistics
//   const getStatistics = (): EvaluationStats => {
//     const total = imageTuples.length;
//     const evaluated = evaluationResults.length;
    
//     // Generate mark distribution
//     const markDistribution: Record<string, number> = {};
//     marks.forEach(mark => {
//       markDistribution[mark.id] = 0;
//     });
    
//     evaluationResults.forEach(result => {
//       if (markDistribution[result.mark] !== undefined) {
//         markDistribution[result.mark]++;
//       }
//     });
    
//     // Calculate face detection statistics
//     const faceDetectionStats = {
//       totalFacesDetected: evaluationResults.reduce((sum, result) => 
//         sum + (result.faceDetection?.faceCount || 0), 0),
//       imagesWithFaces: evaluationResults.filter(result => 
//         result.faceDetection?.hasFaces).length,
//       imagesWithoutFaces: evaluationResults.filter(result => 
//         result.faceDetection && !result.faceDetection.hasFaces).length
//     };
    
//     return {
//       total,
//       evaluated,
//       markDistribution,
//       faceDetection: faceDetectionStats
//     };
//   };

  
//   // Navigation functions
//   const startEvaluation = () => {
//     if (folderStructure.selectedFolders.length < 2 || marks.length === 0) {
//       alert('You need to select at least 2 folders and add at least one mark');
//       return;
//     }
    
//     // In a real implementation, we would generate tuples here based on the selected folders
//     // For now, we'll use dummy data
//     generateDummyTuples();
    
//     // Navigate to evaluation page
//     router.push('/evaluation');
//   };
  
//   const endEvaluation = () => {
//     router.push('/statistics');
//   };
  
//   const resetEvaluation = () => {
//     setFolderStructure({
//       root: '',
//       necessaryFolders: {
//         originals: false,
//         target: false,
//       },
//       optionalFolders: {},
//       selectedFolders: [],
//     });
//     setMarks([]);
//     setImageTuples([]);
//     setCurrentTupleIndex(0);
//     setEvaluationResults([]);
//     router.push('/');
//   };
  
//   // Helper function to generate dummy tuples (will be replaced with actual file system logic)
//   const generateDummyTuples = () => {
//     const dummyTuples: ImageTuple[] = [];
//     const fileCount = 10; // Number of dummy files
    
//     for (let i = 0; i < fileCount; i++) {
//       const filename = `image_${i + 1}.jpg`;
//       const paths: Record<string, string> = {};
      
//       folderStructure.selectedFolders.forEach(folder => {
//         paths[folder] = `${folderStructure.root}/${folder}/${filename}`;
//       });
      
//       dummyTuples.push({
//         id: `tuple-${i}`,
//         filename,
//         paths,
//       });
//     }
    
//     setImageTuples(dummyTuples);
//   };
  
//   const value = {
//     folderStructure,
//     setRootFolder,
//     toggleFolderSelection,
//     marks,
//     addMark,
//     imageTuples,
//     currentTupleIndex,
//     setImageTuples,
//     goToNextTuple,
//     evaluationResults,
//     assignMark,
//     getStatistics,
//     startEvaluation,
//     endEvaluation,
//     removeMark,
//     resetEvaluation,
//   };
  
//   return (
//     <EvaluationContext.Provider value={value}>
//       {children}
//     </EvaluationContext.Provider>
//   );
// };

// export const useEvaluation = () => {
//   const context = useContext(EvaluationContext);
//   if (context === undefined) {
//     throw new Error('useEvaluation must be used within an EvaluationProvider');
//   }
//   return context;
// };


// src/contexts/EvaluationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FolderStructure, Mark, ImageTuple, EvaluationResult, EvaluationStats } from '@/types';
import { useRouter } from 'next/navigation';

interface EvaluationContextType {
  // Folder structure
  folderStructure: FolderStructure;
  setRootFolder: (structure: FolderStructure) => void;
  toggleFolderSelection: (folderName: string) => void;
  
  // Marks
  marks: Mark[];
  addMark: (label: string) => void;
  removeMark: (id: string) => void;
  
  // Image tuples
  imageTuples: ImageTuple[];
  currentTupleIndex: number;
  setImageTuples: (tuples: ImageTuple[]) => void;
  goToNextTuple: () => void;
  goToPreviousTuple: () => void;
  
  // Evaluation
  evaluationResults: EvaluationResult[];
  assignMark: (tupleId: string, markId: string) => void;
  
  // Image loading
  getImageUrl: (tuple: ImageTuple, folderName: string) => Promise<string>;
  
  // Statistics
  getStatistics: () => EvaluationStats;
  
  // Navigation
  startEvaluation: () => void;
  endEvaluation: () => void;
  resetEvaluation: () => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  // Folder structure state
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({
    root: '',
    necessaryFolders: {
      originals: false,
      target: false,
    },
    optionalFolders: {},
    selectedFolders: [],
  });
  
  // Marks state
  const [marks, setMarks] = useState<Mark[]>([
    // Default marks
    { id: 'mark-1', label: 'Excellent' },
    { id: 'mark-2', label: 'Good' },
    { id: 'mark-3', label: 'Fair' },
    { id: 'mark-4', label: 'Poor' },
  ]);
  
  // Image tuples state
  const [imageTuples, setImageTuples] = useState<ImageTuple[]>([]);
  const [currentTupleIndex, setCurrentTupleIndex] = useState(0);
  
  // Evaluation results state
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  
  // Image URL cache
  const [imageUrlCache, setImageUrlCache] = useState<Record<string, string>>({});
  
  // Set root folder
  const setRootFolder = (structure: FolderStructure) => {
    setFolderStructure(structure);
  };
  
  // Toggle folder selection
  const toggleFolderSelection = (folderName: string) => {
    const isSelected = folderStructure.selectedFolders.includes(folderName);
    const newSelectedFolders = isSelected
      ? folderStructure.selectedFolders.filter(name => name !== folderName)
      : [...folderStructure.selectedFolders, folderName];
    
    setFolderStructure({
      ...folderStructure,
      selectedFolders: newSelectedFolders,
    });
  };
  
  // Add a new mark
  const addMark = (label: string) => {
    if (!label.trim()) return;
    
    const newMark: Mark = {
      id: `mark-${Date.now()}`,
      label: label.trim(),
    };
    
    setMarks([...marks, newMark]);
  };
  
  // Remove a mark
  const removeMark = (id: string) => {
    setMarks(marks.filter(mark => mark.id !== id));
  };
  
  // Go to next tuple
  const goToNextTuple = () => {
    if (currentTupleIndex < imageTuples.length - 1) {
      setCurrentTupleIndex(currentTupleIndex + 1);
    }
  };
  
  // Go to previous tuple
  const goToPreviousTuple = () => {
    if (currentTupleIndex > 0) {
      setCurrentTupleIndex(currentTupleIndex - 1);
    }
  };
  
  // Assign mark to current tuple
  const assignMark = (tupleId: string, markId: string) => {
    const existingResultIndex = evaluationResults.findIndex(result => result.tupleId === tupleId);
    
    if (existingResultIndex >= 0) {
      // Update existing result
      const newResults = [...evaluationResults];
      newResults[existingResultIndex] = { tupleId, mark: markId };
      setEvaluationResults(newResults);
    } else {
      // Add new result
      setEvaluationResults([...evaluationResults, { tupleId, mark: markId }]);
    }
    
    // Automatically go to next tuple if current one hasn't been evaluated before
    if (existingResultIndex === -1 && currentTupleIndex < imageTuples.length - 1) {
      goToNextTuple();
    }
  };
  
  // Get evaluation statistics
  const getStatistics = (): EvaluationStats => {
    const total = imageTuples.length;
    const evaluated = evaluationResults.length;
    
    // Generate mark distribution
    const markDistribution: Record<string, number> = {};
    marks.forEach(mark => {
      markDistribution[mark.id] = 0;
    });
    
    evaluationResults.forEach(result => {
      if (markDistribution[result.mark] !== undefined) {
        markDistribution[result.mark]++;
      }
    });
    
    return {
      total,
      evaluated,
      markDistribution,
    };
  };
  
  // Get image URL
  // Get image URL
  // Insert this corrected function in EvaluationContext.tsx

// Get image URL
  const getImageUrl = async (tuple: ImageTuple, folderName: string): Promise<string> => {
    const cacheKey = `${tuple.id}-${folderName}`;
    
    // Return from cache if available
    if (imageUrlCache[cacheKey]) {
      console.log(`Using cached URL for ${folderName}/${tuple.filename}`);
      return imageUrlCache[cacheKey];
    }
    
    try {
      console.log(`Loading image from ${folderName}/${tuple.filename}`);
      
      // Get directory handle
      const rootDirHandle = tuple.directoryHandle;
      if (!rootDirHandle) throw new Error('Directory handle not available');
      
      // Get subdirectory handle - THIS IS THE CRITICAL PART
      console.log(`Getting folder handle for ${folderName}`);
      let folderHandle;
      try {
        folderHandle = await rootDirHandle.getDirectoryHandle(folderName);
      } catch (error) {
        console.error(`Failed to get directory handle for ${folderName}:`, error);
        throw new Error(`Folder ${folderName} not found or not accessible`);
      }
      
      // Get file handle - use the filename directly
      console.log(`Getting file handle for ${tuple.filename}`);
      let fileHandle;
      try {
        fileHandle = await folderHandle.getFileHandle(tuple.filename);
      } catch (error) {
        console.error(`Failed to get file handle for ${tuple.filename}:`, error);
        throw new Error(`File ${tuple.filename} not found in ${folderName}`);
      }
      
      // Get file object
      console.log(`Getting file object`);
      const file = await fileHandle.getFile();
      
      // Create object URL
      console.log(`Creating object URL for ${file.name} (${file.size} bytes)`);
      const url = URL.createObjectURL(file);
      console.log(`URL created: ${url}`);
      
      // Cache URL
      setImageUrlCache(prev => {
        const newCache = {
          ...prev,
          [cacheKey]: url
        };
        console.log(`Updated cache for ${cacheKey}`);
        return newCache;
      });
      
      return url;
    } catch (error) {
      console.error(`Error loading image from ${folderName}/${tuple.filename}:`, error);
      throw error;
    }
  };
  
  // Navigation functions
  const startEvaluation = () => {
    if (folderStructure.selectedFolders.length < 2 || marks.length === 0) {
      alert('You need to select at least 2 folders and add at least one mark');
      return;
    }
    
    router.push('/evaluation');
  };
  
  const endEvaluation = () => {
    // Clean up object URLs to prevent memory leaks
    Object.values(imageUrlCache).forEach(url => {
      URL.revokeObjectURL(url);
    });
    
    router.push('/statistics');
  };
  
  const resetEvaluation = () => {
    // Clean up object URLs to prevent memory leaks
    Object.values(imageUrlCache).forEach(url => {
      URL.revokeObjectURL(url);
    });
    
    setFolderStructure({
      root: '',
      necessaryFolders: {
        originals: false,
        target: false,
      },
      optionalFolders: {},
      selectedFolders: [],
    });
    setImageTuples([]);
    setCurrentTupleIndex(0);
    setEvaluationResults([]);
    setImageUrlCache({});
    router.push('/');
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up object URLs to prevent memory leaks
      Object.values(imageUrlCache).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageUrlCache]);
  
  const value: EvaluationContextType = {
    folderStructure,
    setRootFolder,
    toggleFolderSelection,
    marks,
    addMark,
    removeMark,
    imageTuples,
    currentTupleIndex,
    setImageTuples,
    goToNextTuple,
    goToPreviousTuple,
    evaluationResults,
    assignMark,
    getImageUrl,
    getStatistics,
    startEvaluation,
    endEvaluation,
    resetEvaluation,
  };
  
  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
};