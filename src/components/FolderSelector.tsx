// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { useEvaluation } from '@/contexts/EvaluationContext';
// import { FolderStructure, ImageTuple } from '@/types';

// export default function FolderSelector() {
//   const { 
//     folderStructure, 
//     setRootFolder, 
//     toggleFolderSelection, 
//     marks,
//     setImageTuples,
//     startEvaluation
//   } = useEvaluation();
  
//   const [rootDirHandle, setRootDirHandle] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
//   // Check if browser supports the File System Access API
//   const isFSAccessSupported = () => {
//     return 'showDirectoryPicker' in window;
//   };
  
//   // Select root directory
//   const handleSelectDirectory = async () => {
//     setLoading(true);
//     setErrorMessage(null);
    
//     try {
//       if (!isFSAccessSupported()) {
//         throw new Error('Your browser does not support the File System Access API. Please use a browser like Chrome or Edge.');
//       }
      
//       // Request directory access
//       const directoryHandle = await window.showDirectoryPicker();
//       setRootDirHandle(directoryHandle);
      
//       // Scan for subdirectories
//       const structure: FolderStructure = {
//         root: directoryHandle.name,
//         necessaryFolders: {
//           originals: false,
//           target: false
//         },
//         optionalFolders: {},
//         selectedFolders: []
//       };
      
//       // Look for subfolders
//       for await (const [name, handle] of directoryHandle.entries()) {
//         if (handle.kind === 'directory') {
//           if (name === 'originals' || name === 'target') {
//             structure.necessaryFolders[name as keyof typeof structure.necessaryFolders] = true;
//             if (!structure.selectedFolders.includes(name)) {
//               structure.selectedFolders.push(name);
//             }
//           } else {
//             structure.optionalFolders[name] = true;
//           }
//         }
//       }
      
//       // Update context with folder structure
//       setRootFolder(structure);
//     } catch (error) {
//       console.error('Error accessing directory:', error);
//       setErrorMessage(error instanceof Error ? error.message : 'Failed to access directory');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Handle folder selection toggle
//   const handleFolderToggle = (folderName: string) => {
//     toggleFolderSelection(folderName);
//   };
  
//   // Handle start evaluation
//   const handleStartEvaluation = async () => {
//     if (!rootDirHandle) {
//       setErrorMessage('Please select a root directory first');
//       return;
//     }
    
//     if (folderStructure.selectedFolders.length < 2) {
//       setErrorMessage('Please select at least 2 folders to compare');
//       return;
//     }
    
//     if (marks.length === 0) {
//       setErrorMessage('Please add at least one quality mark');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       // Find common images across selected folders
//       const tuples = await createImageTuples();
      
//       if (tuples.length === 0) {
//         throw new Error('No common images found in the selected folders');
//       }
      
//       // Update tuples in context
//       setImageTuples(tuples);
      
//       // Start evaluation
//       startEvaluation();
//     } catch (error) {
//       console.error('Error starting evaluation:', error);
//       setErrorMessage(error instanceof Error ? error.message : 'Failed to start evaluation');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Create image tuples from selected folders
//   const createImageTuples = async (): Promise<ImageTuple[]> => {
//     const folderHandles: Record<string, any> = {};
//     const filesByFolder: Record<string, Set<string>> = {};
    
//     // Get handles for all selected folders
//     for (const folderName of folderStructure.selectedFolders) {
//       try {
//         folderHandles[folderName] = await rootDirHandle.getDirectoryHandle(folderName);
//         const imageFiles = await getImagesFromDirectory(folderHandles[folderName]);
//         filesByFolder[folderName] = new Set(imageFiles);
//       } catch (error) {
//         console.error(`Error accessing folder ${folderName}:`, error);
//       }
//     }
    
//     // Find common files across all selected folders
//     let commonFiles: string[] = [];
    
//     if (filesByFolder[folderStructure.selectedFolders[0]]) {
//       commonFiles = Array.from(filesByFolder[folderStructure.selectedFolders[0]]);
      
//       for (let i = 1; i < folderStructure.selectedFolders.length; i++) {
//         const folder = folderStructure.selectedFolders[i];
//         if (filesByFolder[folder]) {
//           commonFiles = commonFiles.filter(file => filesByFolder[folder].has(file));
//         }
//       }
//     }
    
//     // Create tuples for common files
//     const tuples: ImageTuple[] = [];
    
//     for (let i = 0; i < commonFiles.length; i++) {
//       const filename = commonFiles[i];
//       const paths: Record<string, string> = {};
      
//       folderStructure.selectedFolders.forEach(folder => {
//         paths[folder] = `${folder}/${filename}`;
//       });
      
//       tuples.push({
//         id: `tuple-${i}`,
//         filename,
//         paths,
//         directoryHandle: rootDirHandle // Store directory handle for file access
//       });
//     }
    
//     return tuples;
//   };
  
//   // Get all image files from a directory
//   const getImagesFromDirectory = async (directoryHandle: any): Promise<string[]> => {
//     const imageFiles: string[] = [];
    
//     try {
//       for await (const entry of directoryHandle.values()) {
//         if (entry.kind === 'file') {
//           const name = entry.name.toLowerCase();
//           if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) {
//             imageFiles.push(entry.name);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error reading directory contents:', error);
//     }
    
//     return imageFiles;
//   };
  
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Select Folders to Compare</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           <div>
//             <Button onClick={handleSelectDirectory} disabled={loading}>
//               {loading ? 'Loading...' : 'Select Root Directory'}
//             </Button>
//             {folderStructure.root && (
//               <p className="mt-2 text-sm">Selected: {folderStructure.root}</p>
//             )}
//           </div>
          
//           {errorMessage && (
//             <div className="p-3 text-sm rounded-md bg-red-50 text-red-600">
//               {errorMessage}
//             </div>
//           )}
          
//           {(folderStructure.root && !isFSAccessSupported()) && (
//             <div className="p-3 text-sm rounded-md bg-yellow-50 text-yellow-600">
//               Your browser doesn't fully support the File System Access API. The application might not work correctly.
//             </div>
//           )}
          
//           {folderStructure.root && (
//             <div className="space-y-4">
//               <h3 className="text-md font-medium">Available Folders</h3>
              
//               <div className="space-y-2">
//                 {/* Necessary folders */}
//                 {Object.entries(folderStructure.necessaryFolders).map(([name, exists]) => (
//                   <div key={name} className="flex items-center space-x-2">
//                     <Checkbox 
//                       id={`folder-${name}`} 
//                       checked={folderStructure.selectedFolders.includes(name) && exists}
//                       disabled={!exists}
//                       onCheckedChange={() => handleFolderToggle(name)}
//                     />
//                     <Label htmlFor={`folder-${name}`} className={!exists ? 'text-gray-400' : ''}>
//                       {name} {!exists && '(not found)'}
//                     </Label>
//                   </div>
//                 ))}
                
//                 {/* Optional folders */}
//                 {Object.entries(folderStructure.optionalFolders).map(([name, exists]) => (
//                   <div key={name} className="flex items-center space-x-2">
//                     <Checkbox 
//                       id={`folder-${name}`} 
//                       checked={folderStructure.selectedFolders.includes(name)}
//                       onCheckedChange={() => handleFolderToggle(name)}
//                     />
//                     <Label htmlFor={`folder-${name}`}>
//                       {name}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button 
//           onClick={handleStartEvaluation} 
//           disabled={loading || !folderStructure.root || folderStructure.selectedFolders.length < 2}
//         >
//           {loading ? 'Loading...' : 'Start Evaluation'}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }



// // src/components/FolderSelector.tsx
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { useEvaluation } from '@/contexts/EvaluationContext';
// import { FolderStructure, ImageTuple } from '@/types';

// export default function FolderSelector() {
//   const { 
//     folderStructure, 
//     setRootFolder, 
//     toggleFolderSelection, 
//     marks,
//     setImageTuples,
//     startEvaluation
//   } = useEvaluation();
  
//   const [rootDirHandle, setRootDirHandle] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [commonImageCount, setCommonImageCount] = useState(0);
  
//   // Check if browser supports the File System Access API
//   const isFSAccessSupported = () => {
//     return 'showDirectoryPicker' in window;
//   };
  
//   // Select root directory
//   const handleSelectDirectory = async () => {
//     setLoading(true);
//     setErrorMessage(null);
    
//     try {
//       if (!isFSAccessSupported()) {
//         throw new Error('Your browser does not support the File System Access API. Please use a browser like Chrome or Edge.');
//       }
      
//       // Request directory access
//       const directoryHandle = await (window as any).showDirectoryPicker();
//       setRootDirHandle(directoryHandle);
      
//       // Scan for subdirectories
//       const structure: FolderStructure = {
//         root: directoryHandle.name,
//         necessaryFolders: {
//           originals: false,
//           target: false
//         },
//         optionalFolders: {},
//         selectedFolders: []
//       };
      
//       // Look for subfolders
//       for await (const [name, handle] of directoryHandle.entries()) {
//         if (handle.kind === 'directory') {
//           // Check if this folder contains images
//           const hasImages = await checkForImages(handle);
          
//           if (hasImages) {
//             if (name === 'originals' || name === 'target') {
//               structure.necessaryFolders[name as keyof typeof structure.necessaryFolders] = true;
//               if (!structure.selectedFolders.includes(name)) {
//                 structure.selectedFolders.push(name);
//               }
//             } else {
//               structure.optionalFolders[name] = true;
//             }
//           }
//         }
//       }
      
//       // Update context with folder structure
//       setRootFolder(structure);
      
//       // Check for common images if we have selected folders
//       if (structure.selectedFolders.length >= 2) {
//         const commonImages = await findCommonImages(directoryHandle, structure.selectedFolders);
//         setCommonImageCount(commonImages.length);
//       }
//     } catch (error) {
//       console.error('Error accessing directory:', error);
//       setErrorMessage(error instanceof Error ? error.message : 'Failed to access directory');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Check if a directory contains images
//   const checkForImages = async (directoryHandle: any): Promise<boolean> => {
//     try {
//       for await (const entry of directoryHandle.values()) {
//         if (entry.kind === 'file') {
//           const name = entry.name.toLowerCase();
//           if (isImageFile(name)) {
//             return true;
//           }
//         }
//       }
//       return false;
//     } catch (error) {
//       console.error('Error checking for images:', error);
//       return false;
//     }
//   };
  
//   // Check if a filename is an image
//   const isImageFile = (filename: string): boolean => {
//     return filename.endsWith('.jpg') || 
//            filename.endsWith('.jpeg') || 
//            filename.endsWith('.png') || 
//            filename.endsWith('.gif') ||
//            filename.endsWith('.webp') ||
//            filename.endsWith('.bmp') ||
//            filename.endsWith('.tiff') ||
//            filename.endsWith('.avif');
//   };
  
//   // Handle folder selection toggle
//   const handleFolderToggle = async (folderName: string) => {
//     toggleFolderSelection(folderName);
    
//     // Update common image count when selection changes
//     if (rootDirHandle && folderStructure.selectedFolders.length >= 1) {
//       // Simulate the toggle to calculate with the new selection
//       const updatedSelection = folderStructure.selectedFolders.includes(folderName)
//         ? folderStructure.selectedFolders.filter(name => name !== folderName)
//         : [...folderStructure.selectedFolders, folderName];
      
//       if (updatedSelection.length >= 2) {
//         const commonImages = await findCommonImages(rootDirHandle, updatedSelection);
//         setCommonImageCount(commonImages.length);
//       } else {
//         setCommonImageCount(0);
//       }
//     }
//   };
  
//   // Handle start evaluation
//   const handleStartEvaluation = async () => {
//     if (!rootDirHandle) {
//       setErrorMessage('Please select a root directory first');
//       return;
//     }
    
//     if (folderStructure.selectedFolders.length < 2) {
//       setErrorMessage('Please select at least 2 folders to compare');
//       return;
//     }
    
//     if (marks.length === 0) {
//       setErrorMessage('Please add at least one quality mark');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       // Find common images across selected folders
//       const tuples = await createImageTuples();
      
//       if (tuples.length === 0) {
//         throw new Error('No common images found in the selected folders');
//       }
      
//       // Update tuples in context
//       setImageTuples(tuples);
      
//       // Start evaluation
//       startEvaluation();
//     } catch (error) {
//       console.error('Error starting evaluation:', error);
//       setErrorMessage(error instanceof Error ? error.message : 'Failed to start evaluation');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Find common images across folders
// // Find common images across folders
// //     const findCommonImages = async (
// //     directoryHandle: any, 
// //     folderNames: string[]
// //   ): Promise<string[]> => {
// //     if (folderNames.length < 2) return [];
    
// //     try {
// //       const filesByFolder: Record<string, Set<string>> = {};
      
// //       // Get files for each folder
// //       for (const folderName of folderNames) {
// //         console.log(`Scanning ${folderName} for images...`);
// //         const folderHandle = await directoryHandle.getDirectoryHandle(folderName);
// //         const images = await getImagesFromDirectory(folderHandle);
// //         console.log(`Found ${images.length} images in ${folderName}`);
// //         filesByFolder[folderName] = new Set(images);
// //       }
      
// //       // Find common files
// //       let commonFiles = Array.from(filesByFolder[folderNames[0]] || []);
// //       console.log(`Starting with ${commonFiles.length} files from ${folderNames[0]}`);
      
// //       for (let i = 1; i < folderNames.length; i++) {
// //         const folder = folderNames[i];
// //         const folderFiles = filesByFolder[folder];
// //         console.log(`Checking for matches in ${folder} (${folderFiles.size} files)`);
        
// //         commonFiles = commonFiles.filter(file => {
// //           const isCommon = folderFiles.has(file);
// //           return isCommon;
// //         });
        
// //         console.log(`Found ${commonFiles.length} common files after checking ${folder}`);
// //       }
      
// //       // Log the common files for debugging
// //       if (commonFiles.length > 0) {
// //         console.log(`Common image files: ${commonFiles.slice(0, 5).join(', ')}${commonFiles.length > 5 ? '...' : ''}`);
// //       } else {
// //         console.log('No common image files found!');
// //       }
      
// //       return commonFiles;
// //     } catch (error) {
// //       console.error('Error finding common images:', error);
// //       return [];
// //     }
// //   };
// // Find common images across folders
// const findCommonImages = async (
//     directoryHandle: any, 
//     folderNames: string[]
//   ): Promise<string[]> => {
//     if (folderNames.length < 2) return [];
    
//     try {
//       const filesByFolder: Record<string, Set<string>> = {};
      
//       // Get files for each folder
//       for (const folderName of folderNames) {
//         console.log(`Scanning ${folderName} for images...`);
//         const folderHandle = await directoryHandle.getDirectoryHandle(folderName);
//         const images = await getImagesFromDirectory(folderHandle);
//         console.log(`Found ${images.length} images in ${folderName}`);
//         filesByFolder[folderName] = new Set(images);
//       }
      
//       // Find common files
//       let commonFiles = Array.from(filesByFolder[folderNames[0]] || []);
//       console.log(`Starting with ${commonFiles.length} files from ${folderNames[0]}`);
      
//       for (let i = 1; i < folderNames.length; i++) {
//         const folder = folderNames[i];
//         const folderFiles = filesByFolder[folder];
//         console.log(`Checking for matches in ${folder} (${folderFiles.size} files)`);
        
//         commonFiles = commonFiles.filter(file => {
//           const isCommon = folderFiles.has(file);
//           return isCommon;
//         });
        
//         console.log(`Found ${commonFiles.length} common files after checking ${folder}`);
//       }
      
//       // Log the common files for debugging
//       if (commonFiles.length > 0) {
//         console.log(`Common image files: ${commonFiles.slice(0, 5).join(', ')}${commonFiles.length > 5 ? '...' : ''}`);
//       } else {
//         console.log('No common image files found!');
//       }
      
//       return commonFiles;
//     } catch (error) {
//       console.error('Error finding common images:', error);
//       return [];
//     }
//   };
  
//   // Create image tuples from selected folders
//   // Insert this corrected function in FolderSelector.tsx

// // Create image tuples from selected folders
// const createImageTuples = async (): Promise<ImageTuple[]> => {
//     console.log("Creating image tuples from selected folders");
    
//     // First find all common images
//     const commonFiles = await findCommonImages(rootDirHandle, folderStructure.selectedFolders);
//     console.log(`Found ${commonFiles.length} common files across selected folders`);
    
//     if (commonFiles.length === 0) {
//       return [];
//     }
    
//     // Create tuples for common files
//     const tuples: ImageTuple[] = [];
    
//     for (let i = 0; i < commonFiles.length; i++) {
//       const filename = commonFiles[i];
//       // IMPORTANT CHANGE: We're now storing JUST the filename in the paths, not a constructed path
//       const paths: Record<string, string> = {};
      
//       folderStructure.selectedFolders.forEach(folder => {
//         // Store just the filename - we'll use the folder name separately when accessing
//         paths[folder] = filename;
//       });
      
//       console.log(`Creating tuple for ${filename} across ${Object.keys(paths).length} folders`);
      
//       tuples.push({
//         id: `tuple-${i}`,
//         filename,
//         paths,
//         directoryHandle: rootDirHandle // Store directory handle for file access
//       });
//     }
    
//     return tuples;
//   };
  
//   // Get all image files from a directory
//   const getImagesFromDirectory = async (directoryHandle: any): Promise<string[]> => {
//     const imageFiles: string[] = [];
    
//     try {
//       for await (const entry of directoryHandle.values()) {
//         if (entry.kind === 'file') {
//           const name = entry.name;
//           if (isImageFile(name.toLowerCase())) {
//             imageFiles.push(name);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error reading directory contents:', error);
//     }
    
//     return imageFiles;
//   };
  
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Select Folders to Compare</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           <div>
//             <Button onClick={handleSelectDirectory} disabled={loading}>
//               {loading ? 'Loading...' : 'Select Root Directory'}
//             </Button>
//             {folderStructure.root && (
//               <p className="mt-2 text-sm">Selected: {folderStructure.root}</p>
//             )}
//           </div>
          
//           {errorMessage && (
//             <div className="p-3 text-sm rounded-md bg-red-50 text-red-600">
//               {errorMessage}
//             </div>
//           )}
          
//           {(folderStructure.root && !isFSAccessSupported()) && (
//             <div className="p-3 text-sm rounded-md bg-yellow-50 text-yellow-600">
//               Your browser doesn't fully support the File System Access API. The application might not work correctly.
//             </div>
//           )}
          
//           {folderStructure.root && (
//             <div className="space-y-4">
//               <h3 className="text-md font-medium">Available Folders</h3>
              
//               <div className="space-y-2">
//                 {/* Necessary folders */}
//                 {Object.entries(folderStructure.necessaryFolders).map(([name, exists]) => (
//                   <div key={name} className="flex items-center space-x-2">
//                     <Checkbox 
//                       id={`folder-${name}`} 
//                       checked={folderStructure.selectedFolders.includes(name) && exists}
//                       disabled={!exists}
//                       onCheckedChange={() => handleFolderToggle(name)}
//                     />
//                     <Label htmlFor={`folder-${name}`} className={!exists ? 'text-gray-400' : ''}>
//                       {name} {!exists && '(not found or no images)'}
//                     </Label>
//                   </div>
//                 ))}
                
//                 {/* Optional folders */}
//                 {Object.entries(folderStructure.optionalFolders).map(([name, exists]) => (
//                   <div key={name} className="flex items-center space-x-2">
//                     <Checkbox 
//                       id={`folder-${name}`} 
//                       checked={folderStructure.selectedFolders.includes(name)}
//                       onCheckedChange={() => handleFolderToggle(name)}
//                     />
//                     <Label htmlFor={`folder-${name}`}>
//                       {name}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
              
//               {folderStructure.selectedFolders.length >= 2 && (
//                 <div className="p-3 text-sm rounded-md bg-blue-50 text-blue-600">
//                   Found {commonImageCount} common image{commonImageCount !== 1 ? 's' : ''} across selected folders.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button 
//           onClick={handleStartEvaluation} 
//           disabled={loading || !folderStructure.root || folderStructure.selectedFolders.length < 2 || commonImageCount === 0}
//         >
//           {loading ? 'Loading...' : commonImageCount > 0 ? `Start Evaluation (${commonImageCount} images)` : 'Start Evaluation'}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }


// src/components/FolderSelector.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { FolderStructure, ImageTuple } from '@/types';

export default function FolderSelector() {
  const { 
    folderStructure, 
    setRootFolder, 
    toggleFolderSelection, 
    marks,
    setImageTuples,
    startEvaluation
  } = useEvaluation();
  
  const [rootDirHandle, setRootDirHandle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [commonImageCount, setCommonImageCount] = useState(0);
  
  // Check if browser supports the File System Access API
  const isFSAccessSupported = () => {
    return 'showDirectoryPicker' in window;
  };
  
  // Select root directory
  const handleSelectDirectory = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      if (!isFSAccessSupported()) {
        throw new Error('Your browser does not support the File System Access API. Please use a browser like Chrome or Edge.');
      }
      
      // Request directory access
      const directoryHandle = await (window as any).showDirectoryPicker();
      setRootDirHandle(directoryHandle);
      
      // Scan for subdirectories
      const structure: FolderStructure = {
        root: directoryHandle.name,
        necessaryFolders: {
          originals: false,
          target: false
        },
        optionalFolders: {},
        selectedFolders: []
      };
      
      // Look for subfolders
      for await (const [name, handle] of directoryHandle.entries()) {
        if (handle.kind === 'directory') {
          // Check if this folder contains images
          const hasImages = await checkForImages(handle);
          
          if (hasImages) {
            if (name === 'originals' || name === 'target') {
              structure.necessaryFolders[name as keyof typeof structure.necessaryFolders] = true;
              if (!structure.selectedFolders.includes(name)) {
                structure.selectedFolders.push(name);
              }
            } else {
              structure.optionalFolders[name] = true;
            }
          }
        }
      }
      
      // Update context with folder structure
      setRootFolder(structure);
      
      // Check for common images if we have selected folders
      if (structure.selectedFolders.length >= 2) {
        const commonImages = await findCommonImages(directoryHandle, structure.selectedFolders);
        setCommonImageCount(commonImages.length);
      }
    } catch (error) {
      console.error('Error accessing directory:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to access directory');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if a directory contains images
  const checkForImages = async (directoryHandle: any): Promise<boolean> => {
    try {
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file') {
          const name = entry.name.toLowerCase();
          if (isImageFile(name)) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking for images:', error);
      return false;
    }
  };
  
  // Check if a filename is an image
  const isImageFile = (filename: string): boolean => {
    return filename.endsWith('.jpg') || 
           filename.endsWith('.jpeg') || 
           filename.endsWith('.png') || 
           filename.endsWith('.gif') ||
           filename.endsWith('.webp') ||
           filename.endsWith('.bmp') ||
           filename.endsWith('.tiff') ||
           filename.endsWith('.avif');
  };
  
  // Handle folder selection toggle
  const handleFolderToggle = async (folderName: string) => {
    toggleFolderSelection(folderName);
    
    // Update common image count when selection changes
    if (rootDirHandle && folderStructure.selectedFolders.length >= 1) {
      // Simulate the toggle to calculate with the new selection
      const updatedSelection = folderStructure.selectedFolders.includes(folderName)
        ? folderStructure.selectedFolders.filter(name => name !== folderName)
        : [...folderStructure.selectedFolders, folderName];
      
      if (updatedSelection.length >= 2) {
        const commonImages = await findCommonImages(rootDirHandle, updatedSelection);
        setCommonImageCount(commonImages.length);
      } else {
        setCommonImageCount(0);
      }
    }
  };
  
  // Handle start evaluation
  const handleStartEvaluation = async () => {
    if (!rootDirHandle) {
      setErrorMessage('Please select a root directory first');
      return;
    }
    
    if (folderStructure.selectedFolders.length < 2) {
      setErrorMessage('Please select at least 2 folders to compare');
      return;
    }
    
    if (marks.length === 0) {
      setErrorMessage('Please add at least one quality mark');
      return;
    }
    
    setLoading(true);
    
    try {
      // Find common images across selected folders
      const tuples = await createImageTuples();
      
      if (tuples.length === 0) {
        throw new Error('No common images found in the selected folders');
      }
      
      // Update tuples in context
      setImageTuples(tuples);
      
      // Start evaluation
      startEvaluation();
    } catch (error) {
      console.error('Error starting evaluation:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start evaluation');
    } finally {
      setLoading(false);
    }
  };
  
  // Find common images across folders
  // Find common images across folders
  // Find common images across folders
  const findCommonImages = async (
    directoryHandle: any, 
    folderNames: string[]
  ): Promise<string[]> => {
    if (folderNames.length < 2) return [];
    
    try {
      const filesByFolder: Record<string, Set<string>> = {};
      
      // Get files for each folder
      for (const folderName of folderNames) {
        console.log(`Scanning ${folderName} for images...`);
        const folderHandle = await directoryHandle.getDirectoryHandle(folderName);
        const images = await getImagesFromDirectory(folderHandle);
        console.log(`Found ${images.length} images in ${folderName}`);
        filesByFolder[folderName] = new Set(images);
      }
      
      // Find common files
      let commonFiles = Array.from(filesByFolder[folderNames[0]] || []);
      console.log(`Starting with ${commonFiles.length} files from ${folderNames[0]}`);
      
      for (let i = 1; i < folderNames.length; i++) {
        const folder = folderNames[i];
        const folderFiles = filesByFolder[folder];
        console.log(`Checking for matches in ${folder} (${folderFiles.size} files)`);
        
        commonFiles = commonFiles.filter(file => {
          const isCommon = folderFiles.has(file);
          return isCommon;
        });
        
        console.log(`Found ${commonFiles.length} common files after checking ${folder}`);
      }
      
      // Log the common files for debugging
      if (commonFiles.length > 0) {
        console.log(`Common image files: ${commonFiles.slice(0, 5).join(', ')}${commonFiles.length > 5 ? '...' : ''}`);
      } else {
        console.log('No common image files found!');
      }
      
      return commonFiles;
    } catch (error) {
      console.error('Error finding common images:', error);
      return [];
    }
  };
  
  // Create image tuples from selected folders
  // Insert this corrected function in FolderSelector.tsx

// Create image tuples from selected folders
    const createImageTuples = async (): Promise<ImageTuple[]> => {
    console.log("Creating image tuples from selected folders");
    
    // First find all common images
    const commonFiles = await findCommonImages(rootDirHandle, folderStructure.selectedFolders);
    console.log(`Found ${commonFiles.length} common files across selected folders`);
    
    if (commonFiles.length === 0) {
      return [];
    }
    
    // Create tuples for common files
    const tuples: ImageTuple[] = [];
    
    for (let i = 0; i < commonFiles.length; i++) {
      const filename = commonFiles[i];
      // IMPORTANT CHANGE: We're now storing JUST the filename in the paths, not a constructed path
      const paths: Record<string, string> = {};
      
      folderStructure.selectedFolders.forEach(folder => {
        // Store just the filename - we'll use the folder name separately when accessing
        paths[folder] = filename;
      });
      
      console.log(`Creating tuple for ${filename} across ${Object.keys(paths).length} folders`);
      
      tuples.push({
        id: `tuple-${i}`,
        filename,
        paths,
        directoryHandle: rootDirHandle // Store directory handle for file access
      });
    }
    
    return tuples;
  };
  // Get all image files from a directory
  const getImagesFromDirectory = async (directoryHandle: any): Promise<string[]> => {
    const imageFiles: string[] = [];
    
    try {
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file') {
          const name = entry.name;
          if (isImageFile(name.toLowerCase())) {
            imageFiles.push(name);
          }
        }
      }
    } catch (error) {
      console.error('Error reading directory contents:', error);
    }
    
    return imageFiles;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Folders to Compare</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Button onClick={handleSelectDirectory} disabled={loading}>
              {loading ? 'Loading...' : 'Select Root Directory'}
            </Button>
            {folderStructure.root && (
              <p className="mt-2 text-sm">Selected: {folderStructure.root}</p>
            )}
          </div>
          
          {errorMessage && (
            <div className="p-3 text-sm rounded-md bg-red-50 text-red-600">
              {errorMessage}
            </div>
          )}
          
          {(folderStructure.root && !isFSAccessSupported()) && (
            <div className="p-3 text-sm rounded-md bg-yellow-50 text-yellow-600">
              Your browser doesn't fully support the File System Access API. The application might not work correctly.
            </div>
          )}
          
          {folderStructure.root && (
            <div className="space-y-4">
              <h3 className="text-md font-medium">Available Folders</h3>
              
              <div className="space-y-2">
                {/* Necessary folders */}
                {Object.entries(folderStructure.necessaryFolders).map(([name, exists]) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`folder-${name}`} 
                      checked={folderStructure.selectedFolders.includes(name) && exists}
                      disabled={!exists}
                      onCheckedChange={() => handleFolderToggle(name)}
                    />
                    <Label htmlFor={`folder-${name}`} className={!exists ? 'text-gray-400' : ''}>
                      {name} {!exists && '(not found or no images)'}
                    </Label>
                  </div>
                ))}
                
                {/* Optional folders */}
                {Object.entries(folderStructure.optionalFolders).map(([name, exists]) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`folder-${name}`} 
                      checked={folderStructure.selectedFolders.includes(name)}
                      onCheckedChange={() => handleFolderToggle(name)}
                    />
                    <Label htmlFor={`folder-${name}`}>
                      {name}
                    </Label>
                  </div>
                ))}
              </div>
              
              {folderStructure.selectedFolders.length >= 2 && (
                <div className="p-3 text-sm rounded-md bg-blue-50 text-blue-600">
                  Found {commonImageCount} common image{commonImageCount !== 1 ? 's' : ''} across selected folders.
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartEvaluation} 
          disabled={loading || !folderStructure.root || folderStructure.selectedFolders.length < 2 || commonImageCount === 0}
        >
          {loading ? 'Loading...' : commonImageCount > 0 ? `Start Evaluation (${commonImageCount} images)` : 'Start Evaluation'}
        </Button>
      </CardFooter>
    </Card>
  );
}