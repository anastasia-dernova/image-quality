// src/utils/folderUtils.ts
'use client';

import { FolderStructure, ImageTuple } from '@/types';

// Check if browser supports the File System Access API
export const isFSAccessSupported = () => {
  return 'showDirectoryPicker' in window;
};

// Request access to a directory and scan its contents
export const requestDirectoryAccess = async (): Promise<FolderStructure | null> => {
  if (!isFSAccessSupported()) {
    alert('Your browser does not support the File System Access API. Please use a modern browser like Chrome or Edge.');
    return null;
  }

  try {
    // @ts-ignore - TypeScript may not recognize showDirectoryPicker
    const directoryHandle = await window.showDirectoryPicker();
    const rootPath = directoryHandle.name;
    
    // Check for necessary folders
    const necessaryFolders = {
      originals: false,
      target: false
    };
    
    const optionalFolders: Record<string, boolean> = {};
    
    // Scan for subdirectories
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'directory') {
        if (name === 'originals' || name === 'target') {
          necessaryFolders[name as keyof typeof necessaryFolders] = true;
        } else {
          optionalFolders[name] = true;
        }
      }
    }
    
    return {
      root: rootPath,
      necessaryFolders,
      optionalFolders,
      selectedFolders: ['originals', 'target'] // Default to necessary folders
    };
  } catch (error) {
    console.error('Error accessing directory:', error);
    return null;
  }
};

// Get all image files from a directory
export const getImagesFromDirectory = async (directoryHandle: any): Promise<string[]> => {
  const imageFiles: string[] = [];
  
  try {
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'file') {
        const name = entry.name.toLowerCase();
        if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) {
          imageFiles.push(entry.name);
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory contents:', error);
  }
  
  return imageFiles;
};

// Create image tuples from selected folders
export const createImageTuples = async (
  rootDirectoryHandle: any,
  selectedFolders: string[]
): Promise<ImageTuple[]> => {
  const folderHandles: Record<string, any> = {};
  const filesByFolder: Record<string, Set<string>> = {};
  
  // Get handles for all selected folders
  for (const folderName of selectedFolders) {
    try {
      folderHandles[folderName] = await rootDirectoryHandle.getDirectoryHandle(folderName);
      const imageFiles = await getImagesFromDirectory(folderHandles[folderName]);
      filesByFolder[folderName] = new Set(imageFiles);
    } catch (error) {
      console.error(`Error accessing folder ${folderName}:`, error);
    }
  }
  
  // Find common files across all selected folders (starting with originals)
  const originalFiles = Array.from(filesByFolder['originals'] || []);
  const tuples: ImageTuple[] = [];
  
  for (const filename of originalFiles) {
    // Check if file exists in all selected folders
    const isInAllFolders = selectedFolders.every(folder => 
      filesByFolder[folder] && filesByFolder[folder].has(filename)
    );
    
    if (isInAllFolders) {
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
  }
  
  return tuples;
};

// Helper function to get file URLs once directories are selected
export const getFileUrl = async (directoryHandle: any, path: string): Promise<string> => {
  try {
    const parts = path.split('/');
    const filename = parts.pop() || '';
    let currentHandle = directoryHandle;
    
    // Navigate to the correct subdirectory
    for (const part of parts) {
      if (part) {
        currentHandle = await currentHandle.getDirectoryHandle(part);
      }
    }
    
    // Get file
    const fileHandle = await currentHandle.getFileHandle(filename);
    const file = await fileHandle.getFile();
    
    // Create object URL
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error accessing file:', error);
    return '';
  }
};