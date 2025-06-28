export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size?: number;
  parentId?: string;
  path: string;
  created: Date;
  modified: Date;
  isSecure: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  uploadedBy: string;
  content?: File;
  children?: string[];
}

export interface Activity {
  id: string;
  type: 'upload' | 'download' | 'share' | 'delete' | 'restore' | 'create_folder';
  description: string;
  timestamp: Date;
  userId: string;
  fileId?: string;
  fileName?: string;
}

export interface AppState {
  user: User | null;
  files: FileItem[];
  activities: Activity[];
  currentPath: string;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
}