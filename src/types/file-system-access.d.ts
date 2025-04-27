// // Type definitions for File System Access API
// interface FileSystemHandle {
//     readonly kind: 'file' | 'directory';
//     readonly name: string;
//   }
  
//   interface FileSystemFileHandle extends FileSystemHandle {
//     readonly kind: 'file';
//     getFile(): Promise<File>;
//   }
  
//   interface FileSystemDirectoryHandle extends FileSystemHandle {
//     readonly kind: 'directory';
//     getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
//     getFileHandle(name: string): Promise<FileSystemFileHandle>;
//     values(): AsyncIterable<FileSystemHandle>;
//     keys(): AsyncIterable<string>;
//     entries(): AsyncIterable<[string, FileSystemHandle]>;
//   }
  
//   interface FileSystemHandlePermissionDescriptor {
//     mode?: 'read' | 'readwrite';
//   }
  
//   interface Window {
//     showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
//     showOpenFilePicker(options?: {
//       multiple?: boolean;
//       types?: Array<{
//         description?: string;
//         accept: Record<string, string[]>;
//       }>;
//     }): Promise<FileSystemFileHandle[]>;
//     showSaveFilePicker(options?: {
//       types?: Array<{
//         description?: string;
//         accept: Record<string, string[]>;
//       }>;
//     }): Promise<FileSystemFileHandle>;
//   }


interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;
}

interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  getFile(): Promise<File>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory';
  getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string): Promise<FileSystemFileHandle>;
  values(): AsyncIterable<FileSystemHandle>;
  keys(): AsyncIterable<string>;
  entries(): AsyncIterable<[string, FileSystemHandle]>;
}

interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite';
}

interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  showOpenFilePicker(options?: {
    multiple?: boolean;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }): Promise<FileSystemFileHandle[]>;
  showSaveFilePicker(options?: {
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }): Promise<FileSystemFileHandle>;
}