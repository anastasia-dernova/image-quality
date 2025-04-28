// actions.ts

export interface ImageTuple {
    filename: string;
    paths: {
      [folder: string]: string;
    };
  }
  
  export async function getImageUrl(tuple: ImageTuple, folder: string): Promise<string> {
    // If you have real API, replace this URL generation
    const path = tuple.paths[folder];
    return `/images/${path}`; // Adjust according to your real storage path
  }
  