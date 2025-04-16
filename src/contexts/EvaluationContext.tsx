// src/contexts/EvaluationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FolderStructure, Mark, ImageTuple, EvaluationResult, EvaluationStats } from '@/types';
import { useRouter } from 'next/navigation';

interface EvaluationContextType {
  // Folder structure
  folderStructure: FolderStructure;
  setRootFolder: (path: string) => void;
  toggleFolderSelection: (folderName: string) => void;
  
  // Marks
  marks: Mark[];
  addMark: (label: string) => void;
  
  // Image tuples
  imageTuples: ImageTuple[];
  currentTupleIndex: number;
  setImageTuples: (tuples: ImageTuple[]) => void;
  goToNextTuple: () => void;
  
  // Evaluation
  evaluationResults: EvaluationResult[];
  assignMark: (tupleId: string, markId: string) => void;
  
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
  const [marks, setMarks] = useState<Mark[]>([]);
  
  // Image tuples state
  const [imageTuples, setImageTuples] = useState<ImageTuple[]>([]);
  const [currentTupleIndex, setCurrentTupleIndex] = useState(0);
  
  // Evaluation results state
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  
  // Set root folder and scan for necessary/optional folders
  const setRootFolder = (path: string) => {
    // In a real implementation, we would scan the file system
    // For now, we'll just update the state with the path
    setFolderStructure({
      ...folderStructure,
      root: path,
      necessaryFolders: {
        originals: true, // We're assuming these folders exist for demo
        target: true,
      },
      optionalFolders: {}, // We'll populate this when integrating file system access
      selectedFolders: ['originals', 'target'], // Default selection
    });
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
  
  // Go to next tuple
  const goToNextTuple = () => {
    if (currentTupleIndex < imageTuples.length - 1) {
      setCurrentTupleIndex(currentTupleIndex + 1);
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
    
    // Automatically go to next tuple
    goToNextTuple();
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
  
  // Navigation functions
  const startEvaluation = () => {
    if (folderStructure.selectedFolders.length < 2 || marks.length === 0) {
      alert('You need to select at least 2 folders and add at least one mark');
      return;
    }
    
    // In a real implementation, we would generate tuples here based on the selected folders
    // For now, we'll use dummy data
    generateDummyTuples();
    
    // Navigate to evaluation page
    router.push('/evaluation');
  };
  
  const endEvaluation = () => {
    router.push('/statistics');
  };
  
  const resetEvaluation = () => {
    setFolderStructure({
      root: '',
      necessaryFolders: {
        originals: false,
        target: false,
      },
      optionalFolders: {},
      selectedFolders: [],
    });
    setMarks([]);
    setImageTuples([]);
    setCurrentTupleIndex(0);
    setEvaluationResults([]);
    router.push('/');
  };
  
  // Helper function to generate dummy tuples (will be replaced with actual file system logic)
  const generateDummyTuples = () => {
    const dummyTuples: ImageTuple[] = [];
    const fileCount = 10; // Number of dummy files
    
    for (let i = 0; i < fileCount; i++) {
      const filename = `image_${i + 1}.jpg`;
      const paths: Record<string, string> = {};
      
      folderStructure.selectedFolders.forEach(folder => {
        paths[folder] = `${folderStructure.root}/${folder}/${filename}`;
      });
      
      dummyTuples.push({
        id: `tuple-${i}`,
        filename,
        paths,
      });
    }
    
    setImageTuples(dummyTuples);
  };
  
  const value = {
    folderStructure,
    setRootFolder,
    toggleFolderSelection,
    marks,
    addMark,
    imageTuples,
    currentTupleIndex,
    setImageTuples,
    goToNextTuple,
    evaluationResults,
    assignMark,
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