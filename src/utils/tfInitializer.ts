// src/utils/tfInitializer.ts
import * as tf from '@tensorflow/tfjs';

// This function preloads TensorFlow.js and WebGL backend
export async function initializeTensorFlow() {
  try {
    console.log('Initializing TensorFlow.js...');
    
    // Set the backend to WebGL for better performance with image processing
    await tf.setBackend('webgl');
    
    // Initialize TensorFlow
    await tf.ready();
    
    console.log('TensorFlow.js initialized successfully with backend:', tf.getBackend());
    return true;
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    return false;
  }
}

// Call this function as early as possible in your app
// For example, in your main layout or app component
export function initTF() {
  // Only run in the browser
  if (typeof window !== 'undefined') {
    // Use setTimeout to not block the UI thread during app startup
    setTimeout(() => {
      initializeTensorFlow().then(success => {
        if (success) {
          console.log('TensorFlow.js is ready for use');
        } else {
          console.warn('TensorFlow.js initialization failed. Face detection may not work properly.');
        }
      });
    }, 1000);
  }
}