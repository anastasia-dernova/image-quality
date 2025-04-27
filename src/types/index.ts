//works good
export interface FolderStructure {
  root: string;
  necessaryFolders: {
    originals: boolean;
    target: boolean;
  };
  optionalFolders: Record<string, boolean>;
  selectedFolders: string[];
}

export interface Mark {
  id: string;
  label: string;
}

export interface ImageTuple {
  id: string;
  filename: string;
  paths: Record<string, string>;
  directoryHandle?: any; // File system directory handle for accessing files
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

// src/types/index.ts

