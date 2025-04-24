// src/types/index.ts

export interface FolderStructure {
    root: string;
    // necessaryFolders: {
    //   originals: boolean;
    //   target: boolean;
    // };
    optionalFolders: Record<string, boolean>;
    selectedFolders: string[];
    availableFolders: Record<string, boolean>;
  }
  
  export interface Mark {
    id: string;
    label: string;
  }
  
  export interface ImageTuple {
    id: string;
    filename: string;
    paths: Record<string, string>;
  }
  
  export interface EvaluationResult {
    tupleId: string;
    mark: string;
  }
  
  export interface EvaluationStats {
    total: number;
    evaluated: number;
    markDistribution: Record<string, number>;
}


// export interface FolderStructure {
//   root: string;
//   availableFolders: Record<string, boolean>; // was optionalFolders
//   selectedFolders: string[];
// }

// export interface Mark {
//   id: string;
//   label: string;
// }

// export interface ImageTuple {
//   id: string;
//   filename: string;
//   paths: Record<string, string>; // folder name -> path to image
// }

// export interface EvaluationResult {
//   tupleId: string;
//   mark: string;
// }

// export interface EvaluationStats {
//   total: number;
//   evaluated: number;
//   markDistribution: Record<string, number>;
// }
