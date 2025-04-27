'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  detectFaces, 
  drawFaceDetection, 
  calculateZoomRegion,
  applyZoom,
  FaceRegion 
} from '@/services/mediapipeFaceDetectionService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MediaPipeFaceComponentProps {
  imageUrl: string;
  imageId: string;
  showFaceDetection: boolean;
  zoomToFace: boolean;
  onFaceDetected?: (imageId: string, faceRegion: FaceRegion | null) => void;
  commonZoomRegion?: FaceRegion | null;
}

export function MediaPipeFaceComponent({
  imageUrl,
  imageId,
  showFaceDetection,
  zoomToFace,
  onFaceDetected,
  commonZoomRegion
}: MediaPipeFaceComponentProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceRegions, setFaceRegions] = useState<FaceRegion[]>([]);
  const [localZoomRegion, setLocalZoomRegion] = useState<FaceRegion | null>(null);
  
  // Load and process image
  useEffect(() => {
    if (!imageRef.current || !imageUrl) return;
    
    const imageElement = imageRef.current;
    
    // If image is already loaded or gets loaded
    const processImage = async () => {
      if (imageElement.complete) {
        await detectAndProcessFaces();
      } else {
        imageElement.onload = async () => {
          await detectAndProcessFaces();
        };
      }
    };
    
    processImage();
  }, [imageUrl]);
  
  // Apply face detection and drawing when visibility changes
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || faceRegions.length === 0) return;
    
    if (showFaceDetection) {
      drawFaceDetection(canvasRef.current, imageRef.current, faceRegions);
    } else {
      // Clear canvas if face detection is turned off
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [showFaceDetection, faceRegions]);
  
  // Apply zoom when zoom state changes or when common zoom region is provided
  useEffect(() => {
    if (!zoomCanvasRef.current || !imageRef.current) return;
    
    if (zoomToFace) {
      // Use common zoom region if provided, otherwise use local
      const zoomRegion = commonZoomRegion || localZoomRegion;
      
      if (zoomRegion) {
        applyZoom(zoomCanvasRef.current, imageRef.current, zoomRegion);
        zoomCanvasRef.current.style.display = 'block';
        if (imageRef.current) imageRef.current.style.display = 'none';
      }
    } else {
      // Hide zoom canvas if zooming is disabled
      zoomCanvasRef.current.style.display = 'none';
      if (imageRef.current) imageRef.current.style.display = 'block';
    }
  }, [zoomToFace, localZoomRegion, commonZoomRegion]);
  
  // Detect faces and process them
  const detectAndProcessFaces = async () => {
    if (!imageRef.current) return;
    
    setIsDetecting(true);
    try {
      // Detect faces using MediaPipe
      const regions = await detectFaces(imageRef.current);
      setFaceRegions(regions);
      
      // If faces are detected, calculate zoom region
      if (regions.length > 0) {
        const firstFace = regions[0];
        
        // Calculate zoom region
        const zoomRegion = calculateZoomRegion(imageRef.current, firstFace, 1.5);
        setLocalZoomRegion(zoomRegion);
        
        // Notify parent component about detected face
        if (onFaceDetected) {
          onFaceDetected(imageId, firstFace);
        }
        
        // Draw face detection outline if enabled
        if (showFaceDetection && canvasRef.current) {
          drawFaceDetection(canvasRef.current, imageRef.current, regions);
        }
      } else {
        setLocalZoomRegion(null);
        if (onFaceDetected) {
          onFaceDetected(imageId, null);
        }
      }
    } catch (error) {
      console.error('Face detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };
  
  // Manually trigger face detection
  const handleManualDetection = () => {
    detectAndProcessFaces();
  };
  
  return (
    <div className="relative w-full">
      {/* Main image */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Image for face detection"
        className="w-full h-auto"
        style={{ 
          maxHeight: '300px', 
          objectFit: 'contain',
          display: zoomToFace ? 'none' : 'block'
        }}
      />
      
      {/* Canvas for face detection outline */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        width={imageRef.current?.naturalWidth || 400}
        height={imageRef.current?.naturalHeight || 300}
      />
      
      {/* Canvas for zoomed face */}
      <canvas
        ref={zoomCanvasRef}
        className="w-full h-auto"
        width={400}
        height={300}
        style={{ 
          maxHeight: '300px',
          display: zoomToFace ? 'block' : 'none'
        }}
      />
      
      {/* Controls */}
      <div className="mt-2 flex flex-wrap gap-2 items-center">
        <Button 
          size="sm" 
          onClick={handleManualDetection} 
          disabled={isDetecting}
        >
          {isDetecting ? 'Detecting...' : 'Detect Face'}
        </Button>
        
        {faceRegions.length > 0 ? (
          <span className="text-sm text-green-600">
            {faceRegions.length} {faceRegions.length === 1 ? 'face' : 'faces'} detected
          </span>
        ) : (
          <span className="text-sm text-yellow-600">No faces detected</span>
        )}
      </div>
    </div>
  );
}