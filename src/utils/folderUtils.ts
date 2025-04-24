// // src/utils/folderUtils.ts
// 'use client';

// import { FolderStructure, ImageTuple } from '@/types';

// // Comprehensive logging function
// const log = (message: string, data?: any) => {
//   console.log(`[FSAccessAPI] ${message}`, data || '');
// };

// // Enhanced browser support check
// export const isFSAccessSupported = (): boolean => {
//   const supported = 'showDirectoryPicker' in window;
//   log(`Browser support check`, { supported });
//   return supported;
// };

// // Request access to a directory and scan its contents with detailed logging
// export const requestDirectoryAccess = async (): Promise<FolderStructure | null> => {
//   // Detailed browser support check
//   if (!isFSAccessSupported()) {
//     log('Browser does not support File System Access API', {
//       userAgent: navigator.userAgent,
//       platform: navigator.platform
//     });
    
//     // More detailed error messaging
//     const browserInfo = `
//       Your current browser (${navigator.userAgent}) does not fully support the File System Access API. 
//       Recommended browsers:
//       - Google Chrome (Version 86+)
//       - Microsoft Edge (Version 86+)
//       - Other Chromium-based browsers
      
//       Please check:
//       1. Your browser is up to date
//       2. File System Access API is enabled
//       3. You're not in private/incognito mode
//     `;
    
//     alert(browserInfo);
//     return null;
//   }

//   try {
//     log('Attempting to open directory picker');
    
//     // @ts-ignore - TypeScript may not recognize showDirectoryPicker
//     const directoryHandle = await window.showDirectoryPicker({
//       mode: 'read' // Explicitly set read mode
//     });
    
//     log('Directory selected', { 
//       rootName: directoryHandle.name 
//     });
    
//     // Initialize folder detection
//     const necessaryFolders = {
//       originals: false,
//       target: false
//     };
    
//     const optionalFolders: Record<string, boolean> = {};
    
//     // Comprehensive directory scanning
//     log('Starting directory entry scan');
//     const entries: string[] = [];
    
//     try {
//       for await (const [name, handle] of directoryHandle.entries()) {
//         if (handle.kind === 'directory') {
//           entries.push(name);
          
//           // Detect necessary and optional folders
//           if (name === 'originals' || name === 'target') {
//             necessaryFolders[name as keyof typeof necessaryFolders] = true;
//           } else {
//             optionalFolders[name] = true;
//           }
//         }
//       }
//     } catch (scanError) {
//       log('Error scanning directory entries', { error: scanError });
//     }
    
//     log('Directory scan complete', {
//       entries,
//       necessaryFolders,
//       optionalFolders
//     });
    
//     // Validate necessary folders
//     const missingFolders = Object.entries(necessaryFolders)
//       .filter(([_, found]) => !found)
//       .map(([name]) => name);
    
//     if (missingFolders.length > 0) {
//       log('Missing necessary folders', { missingFolders });
//       alert(`Warning: The following necessary folders are missing: ${missingFolders.join(', ')}`);
//     }
    
//     return {
//       root: directoryHandle.name,
//       necessaryFolders,
//       optionalFolders,
//       selectedFolders: Object.keys(necessaryFolders).filter(key => necessaryFolders[key as keyof typeof necessaryFolders])
//     };
//   } catch (error) {
//     log('Directory access error', { 
//       error,
//       name: (error as Error).name,
//       message: (error as Error).message 
//     });
    
//     // More informative error handling
//     if (error instanceof DOMException) {
//       switch (error.name) {
//         case 'AbortError':
//           log('User cancelled directory selection');
//           break;
//         case 'SecurityError':
//           alert('Security error: Unable to access directory. Check browser permissions.');
//           break;
//         default:
//           alert(`Unexpected error: ${error.message}`);
//       }
//     } else {
//       alert('An unexpected error occurred while accessing the directory.');
//     }
    
//     return null;
//   }
// };

// // Enhanced image file detection
// export const getImagesFromDirectory = async (directoryHandle: any): Promise<string[]> => {
//   const imageFiles: string[] = [];
//   const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
  
//   try {
//     log('Scanning directory for image files');
    
//     for await (const entry of directoryHandle.values()) {
//       if (entry.kind === 'file') {
//         const name = entry.name.toLowerCase();
//         const isImageFile = imageExtensions.some(ext => name.endsWith(ext));
        
//         if (isImageFile) {
//           imageFiles.push(entry.name);
//         }
//       }
//     }
    
//     log('Image files found', { count: imageFiles.length, files: imageFiles });
    
//     return imageFiles;
//   } catch (error) {
//     log('Error reading directory contents', { error });
//     return [];
//   }
// };

// // Existing createImageTuples and getFileUrl functions remain the same
// export const createImageTuples = async (
//   rootDirectoryHandle: any,
//   selectedFolders: string[]
// ): Promise<ImageTuple[]> => {
//   const folderHandles: Record<string, any> = {};
//   const filesByFolder: Record<string, Set<string>> = {};
  
//   log('Creating image tuples', { selectedFolders });
  
//   // Get handles for all selected folders
//   for (const folderName of selectedFolders) {
//     try {
//       folderHandles[folderName] = await rootDirectoryHandle.getDirectoryHandle(folderName);
//       const imageFiles = await getImagesFromDirectory(folderHandles[folderName]);
//       filesByFolder[folderName] = new Set(imageFiles);
      
//       log(`Files in ${folderName}`, { count: imageFiles.length });
//     } catch (error) {
//       log(`Error accessing folder ${folderName}`, { error });
//     }
//   }
  
//   // Find common files across all selected folders (starting with originals)
//   const originalFiles = Array.from(filesByFolder['originals'] || []);
//   const tuples: ImageTuple[] = [];
  
//   for (const filename of originalFiles) {
//     // Check if file exists in all selected folders
//     const isInAllFolders = selectedFolders.every(folder => 
//       filesByFolder[folder] && filesByFolder[folder].has(filename)
//     );
    
//     if (isInAllFolders) {
//       const paths: Record<string, string> = {};
      
//       for (const folder of selectedFolders) {
//         paths[folder] = `${folder}/${filename}`;
//       }
      
//       tuples.push({
//         id: `tuple-${filename}`,
//         filename,
//         paths
//       });
//     }
//   }
  
//   log('Image tuples created', { 
//     totalTuples: tuples.length, 
//     selectedFolders 
//   });
  
//   return tuples;
// };

// export const getFileUrl = async (directoryHandle: any, path: string): Promise<string> => {
//   try {
//     const parts = path.split('/');
//     const filename = parts.pop() || '';
//     let currentHandle = directoryHandle;
    
//     // Navigate to the correct subdirectory
//     for (const part of parts) {
//       if (part) {
//         currentHandle = await currentHandle.getDirectoryHandle(part);
//       }
//     }
    
//     // Get file
//     const fileHandle = await currentHandle.getFileHandle(filename);
//     const file = await fileHandle.getFile();
    
//     // Create object URL
//     return URL.createObjectURL(file);
//   } catch (error) {
//     log('Error accessing file', { path, error });
//     return '';
//   }
// };

'use client';

import { FolderStructure, ImageTuple } from '@/types';

const log = (message: string, data?: any) => {
  console.log(`[FSAccessAPI] ${message}`, data || '');
};

export const isFSAccessSupported = (): boolean => {
  const supported = 'showDirectoryPicker' in window;
  log(`Browser support check`, { supported });
  return supported;
};

export const requestDirectoryAccess = async (): Promise<FolderStructure | null> => {
  if (!isFSAccessSupported()) {
    alert('Your browser does not support the File System Access API.');
    return null;
  }

  try {
    // @ts-ignore
    const directoryHandle = await window.showDirectoryPicker({ mode: 'read' });
    log('Directory selected', { rootName: directoryHandle.name });

    const folderNames: string[] = [];
    const folderHandles: Record<string, FileSystemDirectoryHandle> = {};

    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'directory') {
        folderNames.push(name);
        folderHandles[name] = handle;
      }
    }

    return {
      root: directoryHandle.name,
      selectedFolders: folderNames,
      optionalFolders: folderNames.reduce((acc, name) => {
        acc[name] = true;
        return acc;
      }, {} as Record<string, boolean>)
    };
  } catch (error) {
    log('Directory access error', error);
    alert('Error accessing directory.');
    return null;
  }
};

export const getImagesFromDirectory = async (directoryHandle: FileSystemDirectoryHandle): Promise<string[]> => {
  const imageFiles: string[] = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

  try {
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'file') {
        const name = entry.name.toLowerCase();
        if (imageExtensions.some(ext => name.endsWith(ext))) {
          imageFiles.push(entry.name);
        }
      }
    }
  } catch (error) {
    log('Error reading directory', error);
  }

  return imageFiles;
};

export const createImageTuples = async (
  rootDirectoryHandle: FileSystemDirectoryHandle,
  selectedFolders: string[]
): Promise<ImageTuple[]> => {
  const folderHandles: Record<string, FileSystemDirectoryHandle> = {};
  const filesByFolder: Record<string, Set<string>> = {};

  for (const folderName of selectedFolders) {
    try {
      const folderHandle = await rootDirectoryHandle.getDirectoryHandle(folderName);
      folderHandles[folderName] = folderHandle;
      const images = await getImagesFromDirectory(folderHandle);
      filesByFolder[folderName] = new Set(images);
    } catch (error) {
      log(`Error accessing folder: ${folderName}`, error);
    }
  }

  // Find intersection of filenames
  const folderFileSets = Object.values(filesByFolder);
  if (folderFileSets.length === 0) return [];

  const commonFilenames = [...folderFileSets[0]].filter(filename =>
    folderFileSets.every(set => set.has(filename))
  );

  const tuples: ImageTuple[] = [];

  for (const filename of commonFilenames) {
    const paths: Record<string, string> = {};
    for (const folder of selectedFolders) {
      paths[folder] = `${folder}/${filename}`;
    }

    tuples.push({
      id: `tuple-${filename}`,
      filename,
      paths
    });
  }

  log('Generated image tuples', { count: tuples.length });

  return tuples;
};

export const getFileUrl = async (
  directoryHandle: FileSystemDirectoryHandle,
  path: string
): Promise<string> => {
  try {
    const parts = path.split('/');
    const filename = parts.pop()!;
    let currentHandle = directoryHandle;

    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }

    const fileHandle = await currentHandle.getFileHandle(filename);
    const file = await fileHandle.getFile();

    return URL.createObjectURL(file);
  } catch (error) {
    log('Error getting file URL', { path, error });
    return '';
  }
};

