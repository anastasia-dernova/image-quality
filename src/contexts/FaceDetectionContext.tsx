// src/contexts/FaceDetectionContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { FaceRegion } from '@/services/mediapipeFaceDetectionService';
import { FaceDetectionSettings } from '@/types';

interface FaceDetectionState {
  // Settings
  settings: FaceDetectionSettings;
  
  // Face regions by tuple and folder
  detectedRegions: Record<string, Record<string, FaceRegion | null>>;
  
  // Current zoom regions
  currentZoomRegions: Record<string, FaceRegion | null>;
}

interface FaceDetectionContextType extends FaceDetectionState {
  // Settings actions
  toggleFaceDetection: () => void;
  toggleShowOutlines: () => void;
  toggleZoomToFace: () => void;
  setZoomFactor: (factor: number) => void;
  
  // Update face detection data
  updateFaceRegion: (tupleId: string, folderId: string, region: FaceRegion | null) => void;
  
  // Set zoom region for current view
  setCurrentZoomRegion: (tupleId: string, folderId: string, region: FaceRegion | null) => void;
  
  // Get reference face region for a tuple
  getReferenceFaceRegion: (tupleId: string) => FaceRegion | null;
  
  // Clear data
  resetFaceDetection: () => void;
}

const defaultSettings: FaceDetectionSettings = {
  enabled: false,
  showOutlines: true,
  zoomToFace: false,
  zoomFactor: 1.5
};

const FaceDetectionContext = createContext<FaceDetectionContextType | undefined>(undefined);

export const FaceDetectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [settings, setSettings] = useState<FaceDetectionSettings>(defaultSettings);
  const [detectedRegions, setDetectedRegions] = useState<Record<string, Record<string, FaceRegion | null>>>({});
  const [currentZoomRegions, setCurrentZoomRegions] = useState<Record<string, FaceRegion | null>>({});
  
  // Toggle face detection
  const toggleFaceDetection = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };
  
  // Toggle showing face outlines
  const toggleShowOutlines = () => {
    setSettings(prev => ({
      ...prev,
      showOutlines: !prev.showOutlines
    }));
  };
  
  // Toggle zoom to face
  const toggleZoomToFace = () => {
    setSettings(prev => ({
      ...prev,
      zoomToFace: !prev.zoomToFace
    }));
  };
  
  // Set zoom factor
  const setZoomFactor = (factor: number) => {
    setSettings(prev => ({
      ...prev,
      zoomFactor: factor
    }));
  };
  
  // Update face region for a specific image
  const updateFaceRegion = (tupleId: string, folderId: string, region: FaceRegion | null) => {
    setDetectedRegions(prev => {
      // Get existing tuple data or create new
      const tupleData = prev[tupleId] || {};
      
      // Update folder's face region
      const updatedTupleData = {
        ...tupleData,
        [folderId]: region
      };
      
      // Return updated data
      return {
        ...prev,
        [tupleId]: updatedTupleData
      };
    });
  };
  
  // Set current zoom region
  const setCurrentZoomRegion = (tupleId: string, folderId: string, region: FaceRegion | null) => {
    setCurrentZoomRegions(prev => ({
      ...prev,
      [`${tupleId}-${folderId}`]: region
    }));
  };
  
  // Get reference face region for a tuple (typically the first folder)
  const getReferenceFaceRegion = (tupleId: string): FaceRegion | null => {
    const tupleData = detectedRegions[tupleId];
    if (!tupleData) return null;
    
    // Find the first folder with a detected face
    // In a real app, you might want to prioritize a specific folder (e.g., 'originals')
    const folders = Object.keys(tupleData);
    for (const folder of folders) {
      if (tupleData[folder]) {
        return tupleData[folder];
      }
    }
    
    return null;
  };
  
  // Reset face detection state
  const resetFaceDetection = () => {
    setSettings(defaultSettings);
    setDetectedRegions({});
    setCurrentZoomRegions({});
  };
  
  const value: FaceDetectionContextType = {
    // State
    settings,
    detectedRegions,
    currentZoomRegions,
    
    // Actions
    toggleFaceDetection,
    toggleShowOutlines,
    toggleZoomToFace,
    setZoomFactor,
    updateFaceRegion,
    setCurrentZoomRegion,
    getReferenceFaceRegion,
    resetFaceDetection
  };
  
  return (
    <FaceDetectionContext.Provider value={value}>
      {children}
    </FaceDetectionContext.Provider>
  );
};

// Hook to use face detection context
export const useFaceDetection = () => {
  const context = useContext(FaceDetectionContext);
  if (context === undefined) {
    throw new Error('useFaceDetection must be used within a FaceDetectionProvider');
  }
  return context;
};