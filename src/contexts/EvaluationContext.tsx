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