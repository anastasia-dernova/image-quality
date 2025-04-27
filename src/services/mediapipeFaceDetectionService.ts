// src/services/mediapipeFaceDetectionService.ts
'use client';

export interface FaceRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Loads the MediaPipe Face Detection model
 * Note: In a real implementation, you would use the actual MediaPipe library
 * For this example, we're simulating the behavior
 */
export async function loadFaceDetectionModel() {
  // In a real implementation, you would:
  // 1. Import the MediaPipe library
  // 2. Load the face detection model
  // 3. Return the model for reuse
  
  // Simulate loading the model
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('MediaPipe Face Detection model loaded');
  
  // Return a mock model
  return {
    detect: async (imageElement: HTMLImageElement): Promise<FaceRegion[]> => {
      // Simulate face detection with MediaPipe
      // In a real implementation, this would call the actual MediaPipe API
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // For demo purposes, always return a face in the center of the image
      // In a real implementation, this would return actual face detection results
      const width = imageElement.naturalWidth || imageElement.width;
      const height = imageElement.naturalHeight || imageElement.height;
      
      // Simulate detecting a face in the center 30% of the image
      return [{
        x: width * 0.35,
        y: height * 0.3,
        width: width * 0.3,
        height: height * 0.4
      }];
    }
  };
}

/**
 * Detects faces in an image using MediaPipe
 * @param imageElement - The HTML image element to detect faces in
 * @returns A promise that resolves to an array of face regions
 */
export async function detectFaces(imageElement: HTMLImageElement): Promise<FaceRegion[]> {
  try {
    // Load the model
    const model = await loadFaceDetectionModel();
    
    // Wait for the image to be loaded
    if (!imageElement.complete) {
      await new Promise<void>((resolve) => {
        imageElement.onload = () => resolve();
      });
    }
    
    // Detect faces
    return await model.detect(imageElement);
  } catch (error) {
    console.error('Error detecting faces with MediaPipe:', error);
    return [];
  }
}

/**
 * Calculate a consistent zoom region across multiple images based on detected faces
 * @param originalImageElement - Reference image element
 * @param faceRegion - Detected face region
 * @param zoomFactor - How much to zoom (1.0 = no zoom, 2.0 = 2x zoom)
 * @returns Zoom region coordinates
 */
export function calculateZoomRegion(
  imageElement: HTMLImageElement,
  faceRegion: FaceRegion,
  zoomFactor: number = 1.5
): FaceRegion {
  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;
  
  // Calculate center of the face
  const centerX = faceRegion.x + faceRegion.width / 2;
  const centerY = faceRegion.y + faceRegion.height / 2;
  
  // Calculate new dimensions based on zoom factor
  // We want to ensure the face is fully visible so we use the larger dimension
  const maxDimension = Math.max(faceRegion.width, faceRegion.height);
  const newSize = maxDimension * zoomFactor;
  
  // Calculate new region centered on the face
  const zoomRegion: FaceRegion = {
    x: Math.max(0, centerX - newSize / 2),
    y: Math.max(0, centerY - newSize / 2),
    width: newSize,
    height: newSize
  };
  
  // Ensure the region doesn't go beyond the image boundaries
  if (zoomRegion.x + zoomRegion.width > width) {
    zoomRegion.x = width - zoomRegion.width;
  }
  
  if (zoomRegion.y + zoomRegion.height > height) {
    zoomRegion.y = height - zoomRegion.height;
  }
  
  // Ensure x and y are not negative
  zoomRegion.x = Math.max(0, zoomRegion.x);
  zoomRegion.y = Math.max(0, zoomRegion.y);
  
  return zoomRegion;
}

/**
 * Apply the zoom to an image by drawing the zoomed region on a canvas
 * @param canvas - Canvas to draw the zoomed image on
 * @param imageElement - Source image element
 * @param zoomRegion - Region to zoom to
 */
export function applyZoom(
  canvas: HTMLCanvasElement,
  imageElement: HTMLImageElement,
  zoomRegion: FaceRegion
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the zoomed region
  ctx.drawImage(
    imageElement,
    zoomRegion.x, zoomRegion.y, zoomRegion.width, zoomRegion.height,
    0, 0, canvas.width, canvas.height
  );
  
  // Optional: draw a border to show this is a zoomed view
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw face detection results on a canvas (for visualization)
 * @param canvas - Canvas to draw on
 * @param imageElement - Source image
 * @param faceRegions - Detected face regions
 */
export function drawFaceDetection(
  canvas: HTMLCanvasElement,
  imageElement: HTMLImageElement,
  faceRegions: FaceRegion[]
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Get the scale factor between the image and canvas
  const scaleX = canvas.width / imageElement.naturalWidth;
  const scaleY = canvas.height / imageElement.naturalHeight;
  
  // Clear canvas and draw the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
  // Draw face regions
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  
  faceRegions.forEach(region => {
    // Scale the region coordinates to match canvas size
    const scaledX = region.x * scaleX;
    const scaledY = region.y * scaleY;
    const scaledWidth = region.width * scaleX;
    const scaledHeight = region.height * scaleY;
    
    // Draw rectangle around face
    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
  });
}