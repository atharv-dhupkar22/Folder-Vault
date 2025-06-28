import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, FileItem, Activity, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  uploadFiles: (files: File[], parentId?: string) => void;
  createFolder: (name: string, parentId?: string) => void;
  deleteFiles: (fileIds: string[]) => void;
  restoreFiles: (fileIds: string[]) => void;
  permanentDeleteFiles: (fileIds: string[]) => void;
  toggleFavorite: (fileId: string) => void;
  setCurrentPath: (path: string) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSelectedFiles: (fileIds: string[]) => void;
  getFilesByPath: (path: string) => FileItem[];
  getFavoriteFiles: () => FileItem[];
  getRecentFiles: () => FileItem[];
  getDeletedFiles: () => FileItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: null,
  files: [],
  activities: [],
  currentPath: '/',
  searchQuery: '',
  viewMode: 'grid',
  selectedFiles: []
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persistedFiles, setPersistedFiles] = useLocalStorage<FileItem[]>('vault_files', []);
  const [persistedActivities, setPersistedActivities] = useLocalStorage<Activity[]>('vault_activities', []);
  const [persistedUser, setPersistedUser] = useLocalStorage<User | null>('vault_user', null);
  const [persistedUsers, setPersistedUsers] = useLocalStorage<User[]>('vault_users', []);

  const [state, setState] = React.useState<AppState>({
    ...initialState,
    user: persistedUser,
    files: persistedFiles,
    activities: persistedActivities
  });

  useEffect(() => {
    setPersistedFiles(state.files);
  }, [state.files, setPersistedFiles]);

  useEffect(() => {
    setPersistedActivities(state.activities);
  }, [state.activities, setPersistedActivities]);

  useEffect(() => {
    setPersistedUser(state.user);
  }, [state.user, setPersistedUser]);

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
      timestamp: new Date()
    };
    setState(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities].slice(0, 50) // Keep only last 50 activities
    }));
  };

  const register = (email: string, password: string, name: string): boolean => {
    // Check if user already exists
    const existingUser = persistedUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name,
      role: 'user'
    };

    // Save user credentials (in a real app, this would be handled securely on the backend)
    const updatedUsers = [...persistedUsers, { ...newUser, password }];
    setPersistedUsers(updatedUsers);

    // Auto-login the new user
    setState(prev => ({ ...prev, user: newUser }));

    return true;
  };

  const login = (email: string, password: string): boolean => {
    // Find user in stored users
    const user = persistedUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      (u as any).password === password
    );

    if (user) {
      // Remove password from user object before setting state
      const { password: _, ...userWithoutPassword } = user as any;
      setState(prev => ({ ...prev, user: userWithoutPassword }));
      return true;
    }

    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null }));
  };

  const getFileType = (file: File): FileItem['fileType'] => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'document';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) return 'archive';
    return 'other';
  };

  const uploadFiles = (files: File[], parentId?: string) => {
    const parentPath = parentId ? 
      state.files.find(f => f.id === parentId)?.path || '/' : 
      state.currentPath;

    const newFiles: FileItem[] = files.map(file => ({
      id: uuidv4(),
      name: file.name,
      type: 'file',
      fileType: getFileType(file),
      size: file.size,
      parentId,
      path: parentPath === '/' ? `/${file.name}` : `${parentPath}/${file.name}`,
      created: new Date(),
      modified: new Date(),
      isSecure: Math.random() > 0.5, // Random security status for demo
      isFavorite: false,
      isDeleted: false,
      uploadedBy: state.user?.id || '1',
      content: file
    }));

    setState(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));

    addActivity({
      type: 'upload',
      description: `Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`,
      userId: state.user?.id || '1',
      fileName: files.length === 1 ? files[0].name : undefined
    });
  };

  const createFolder = (name: string, parentId?: string) => {
    const parentPath = parentId ? 
      state.files.find(f => f.id === parentId)?.path || '/' : 
      state.currentPath;

    const newFolder: FileItem = {
      id: uuidv4(),
      name,
      type: 'folder',
      parentId,
      path: parentPath === '/' ? `/${name}` : `${parentPath}/${name}`,
      created: new Date(),
      modified: new Date(),
      isSecure: false,
      isFavorite: false,
      isDeleted: false,
      uploadedBy: state.user?.id || '1',
      children: []
    };

    setState(prev => ({
      ...prev,
      files: [...prev.files, newFolder]
    }));

    addActivity({
      type: 'create_folder',
      description: `Created folder "${name}"`,
      userId: state.user?.id || '1',
      fileName: name
    });
  };

  const deleteFiles = (fileIds: string[]) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        fileIds.includes(file.id) 
          ? { ...file, isDeleted: true, deletedAt: new Date() }
          : file
      ),
      selectedFiles: []
    }));

    const fileNames = state.files
      .filter(f => fileIds.includes(f.id))
      .map(f => f.name);

    addActivity({
      type: 'delete',
      description: `Moved ${fileIds.length} item${fileIds.length > 1 ? 's' : ''} to trash`,
      userId: state.user?.id || '1',
      fileName: fileIds.length === 1 ? fileNames[0] : undefined
    });
  };

  const restoreFiles = (fileIds: string[]) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        fileIds.includes(file.id) 
          ? { ...file, isDeleted: false, deletedAt: undefined }
          : file
      )
    }));

    addActivity({
      type: 'restore',
      description: `Restored ${fileIds.length} item${fileIds.length > 1 ? 's' : ''}`,
      userId: state.user?.id || '1'
    });
  };

  const permanentDeleteFiles = (fileIds: string[]) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(file => !fileIds.includes(file.id))
    }));
  };

  const toggleFavorite = (fileId: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        file.id === fileId 
          ? { ...file, isFavorite: !file.isFavorite }
          : file
      )
    }));
  };

  const setCurrentPath = (path: string) => {
    setState(prev => ({ ...prev, currentPath: path }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const setViewMode = (mode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  };

  const setSelectedFiles = (fileIds: string[]) => {
    setState(prev => ({ ...prev, selectedFiles: fileIds }));
  };

  const getFilesByPath = (path: string): FileItem[] => {
    return state.files.filter(file => {
      if (file.isDeleted) return false;
      
      if (path === '/') {
        return !file.parentId || file.path.split('/').length === 2;
      }
      
      return file.path.startsWith(path) && 
             file.path !== path &&
             file.path.split('/').length === path.split('/').length + 1;
    });
  };

  const getFavoriteFiles = (): FileItem[] => {
    return state.files.filter(file => file.isFavorite && !file.isDeleted);
  };

  const getRecentFiles = (): FileItem[] => {
    return state.files
      .filter(file => !file.isDeleted)
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
      .slice(0, 20);
  };

  const getDeletedFiles = (): FileItem[] => {
    return state.files.filter(file => file.isDeleted);
  };

  const value: AppContextType = {
    state,
    login,
    register,
    logout,
    uploadFiles,
    createFolder,
    deleteFiles,
    restoreFiles,
    permanentDeleteFiles,
    toggleFavorite,
    setCurrentPath,
    setSearchQuery,
    setViewMode,
    setSelectedFiles,
    getFilesByPath,
    getFavoriteFiles,
    getRecentFiles,
    getDeletedFiles
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};