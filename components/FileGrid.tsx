import React from 'react';
import { 
  FileText, 
  Image, 
  Film, 
  Music, 
  Archive, 
  File,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Star,
  Lock,
  Folder,
  RotateCcw
} from 'lucide-react';
import { FileItem } from '../types';
import { useApp } from '../context/AppContext';

interface FileGridProps {
  files: FileItem[];
  showDeleted?: boolean;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, showDeleted = false }) => {
  const { state, deleteFiles, restoreFiles, toggleFavorite, setCurrentPath } = useApp();

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'image':
        return Image;
      case 'video':
        return Film;
      case 'audio':
        return Music;
      case 'archive':
        return Archive;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const getFileColor = (fileType?: string) => {
    switch (fileType) {
      case 'image':
        return 'text-green-600 bg-green-50';
      case 'video':
        return 'text-purple-600 bg-purple-50';
      case 'audio':
        return 'text-orange-600 bg-orange-50';
      case 'archive':
        return 'text-yellow-600 bg-yellow-50';
      case 'document':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
    }
  };

  const handleDelete = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFiles([fileId]);
  };

  const handleRestore = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    restoreFiles([fileId]);
  };

  const handleToggleFavorite = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(fileId);
  };

  if (state.viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-3">Modified</div>
          <div className="col-span-2">Actions</div>
        </div>
        {files.map((file) => {
          const IconComponent = file.type === 'folder' ? Folder : getFileIcon(file.fileType);
          const colorClass = file.type === 'folder' ? 'text-blue-600 bg-blue-50' : getFileColor(file.fileType);
          
          return (
            <div 
              key={file.id} 
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <div className="col-span-5 flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    {file.isSecure && <Lock className="w-3 h-3 text-green-600" />}
                    {file.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">{formatSize(file.size)}</span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-sm text-gray-600">{formatDate(file.modified)}</span>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                {showDeleted ? (
                  <button 
                    onClick={(e) => handleRestore(file.id, e)}
                    className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors duration-150"
                    title="Restore"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={(e) => handleToggleFavorite(file.id, e)}
                      className={`p-1 hover:bg-gray-100 rounded transition-colors duration-150 ${
                        file.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${file.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(file.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors duration-150"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {files.map((file) => {
        const IconComponent = file.type === 'folder' ? Folder : getFileIcon(file.fileType);
        const colorClass = file.type === 'folder' ? 'text-blue-600 bg-blue-50' : getFileColor(file.fileType);

        return (
          <div 
            key={file.id} 
            className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  {file.isSecure && (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                  {file.isFavorite && (
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-yellow-600 fill-current" />
                    </div>
                  )}
                  <button className="opacity-0 group-hover:opacity-100 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200">
                    <MoreVertical className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{file.type === 'folder' ? 'Folder' : formatSize(file.size)}</span>
                  <span>{formatDate(file.modified)}</span>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center justify-between">
                {showDeleted ? (
                  <button 
                    onClick={(e) => handleRestore(file.id, e)}
                    className="flex items-center space-x-1 px-2 py-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors duration-150"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-xs">Restore</span>
                  </button>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => handleToggleFavorite(file.id, e)}
                        className={`p-1.5 hover:bg-gray-200 rounded transition-colors duration-150 ${
                          file.isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                        }`}
                        title={file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-3 h-3 ${file.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors duration-150">
                        <Download className="w-3 h-3" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors duration-150">
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(file.id, e)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors duration-150"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};