// // src/services/FaceDetectionService.ts
// import * as tfjs from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-backend-webgl';
// import * as faceDetection from '@tensorflow-models/face-detection';

// // Define the face detection result type
// export interface FaceDetectionResult {
//   boundingBox: {
//     xMin: number;
//     yMin: number;
//     width: number;
//     height: number;
//     xCenter: number;
//     yCenter: number;
//   };
//   landmarks?: number[][];
//   probability?: number;
// }

// class FaceDetectionService {
//   private detector: faceDetection.FaceDetector | null = null;
//   private isInitialized = false;
//   private initializationPromise: Promise<void> | null = null;

//   constructor() {
//     // Initialize the model
//     this.initialize();
//   }

//   /**
//    * Initialize the face detection model
//    */
//   async initialize(): Promise<void> {
//     if (this.isInitialized || this.initializationPromise) {
//       return this.initializationPromise;
//     }

//     this.initializationPromise = new Promise<void>(async (resolve) => {
//       try {
//         console.log('Initializing TensorFlow.js...');
//         await tfjs.ready();
        
//         console.log('Loading face detection model...');
//         const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
//         const detectorConfig = {
//           runtime: 'tfjs' as const,
//           modelType: 'short' as const, // Use the lightweight model for better performance
//           maxFaces: 1, // We only need to detect one face for zooming
//         };
        
//         this.detector = await faceDetection.createDetector(model, detectorConfig);
//         this.isInitialized = true;
//         console.log('Face detection model initialized successfully');
//         resolve();
//       } catch (error) {
//         console.error('Error initializing face detection:', error);
//         this.isInitialized = false;
//         this.initializationPromise = null;
//         resolve(); // Resolve anyway to prevent hanging promises
//       }
//     });

//     return this.initializationPromise;
//   }

//   /**
//    * Detect faces in an image
//    * @param image The image element or URL to detect faces in
//    * @returns An array of face detection results
//    */
//   async detectFaces(image: HTMLImageElement): Promise<FaceDetectionResult[]> {
//     if (!this.isInitialized) {
//       await this.initialize();
//     }

//     if (!this.detector || !this.isInitialized) {
//       console.error('Face detector not initialized');
//       return [];
//     }

//     try {
//       const faces = await this.detector.estimateFaces(image);
      
//       // Convert the face detection results to our format
//       return faces.map(face => {
//         // MediaPipe face detector returns coordinates in pixels
//         const box = face.box;
//         return {
//           boundingBox: {
//             xMin: box.xMin,
//             yMin: box.yMin,
//             width: box.width,
//             height: box.height,
//             xCenter: box.xMin + box.width / 2,
//             yCenter: box.yMin + box.height / 2
//           },
//           landmarks: face.keypoints?.map(kp => [kp.x, kp.y]),
//           probability: face.score
//         };
//       });
//     } catch (error) {
//       console.error('Error detecting faces:', error);
//       return [];
//     }
//   }

//   /**
//    * Calculate the common region to zoom in on for a set of images
//    * @param faceResults Array of face detection results for different images
//    * @param padding Padding to add around the face (as a factor of face size)
//    * @returns A normalized bounding box that can be applied to all images
//    */
//   calculateCommonZoomRegion(
//     faceResults: FaceDetectionResult[],
//     imageWidths: number[],
//     imageHeights: number[],
//     padding = 0.5
//   ): { x: number, y: number, width: number, height: number } | null {
//     if (faceResults.length === 0 || faceResults.some(result => !result)) {
//       return null;
//     }

//     // Calculate normalized positions for each face
//     const normalizedFaces = faceResults.map((face, index) => {
//       const imageWidth = imageWidths[index];
//       const imageHeight = imageHeights[index];
      
//       if (!imageWidth || !imageHeight) return null;

//       const box = face.boundingBox;
      
//       // Apply padding to the face box
//       const paddedWidth = box.width * (1 + padding);
//       const paddedHeight = box.height * (1 + padding);
      
//       // Calculate the top-left corner with padding
//       const xMin = Math.max(0, box.xCenter - paddedWidth / 2) / imageWidth;
//       const yMin = Math.max(0, box.yCenter - paddedHeight / 2) / imageHeight;
      
//       // Calculate width and height, ensuring they don't go beyond image bounds
//       const width = Math.min(paddedWidth / imageWidth, 1 - xMin);
//       const height = Math.min(paddedHeight / imageHeight, 1 - yMin);

//       return { x: xMin, y: yMin, width, height };
//     }).filter(Boolean);

//     if (normalizedFaces.length === 0) {
//       return null;
//     }

//     // Use the average of all face regions for consistency
//     const avgRegion = normalizedFaces.reduce((acc, region) => {
//       acc.x += region!.x;
//       acc.y += region!.y;
//       acc.width += region!.width;
//       acc.height += region!.height;
//       return acc;
//     }, { x: 0, y: 0, width: 0, height: 0 });

//     avgRegion.x /= normalizedFaces.length;
//     avgRegion.y /= normalizedFaces.length;
//     avgRegion.width /= normalizedFaces.length;
//     avgRegion.height /= normalizedFaces.length;

//     return avgRegion;
//   }
// }

// // Export a singleton instance
// const faceDetectionService = new FaceDetectionService();
// export default faceDetectionService;