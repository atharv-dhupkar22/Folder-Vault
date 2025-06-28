import React from 'react';
import { 
  Home, 
  Folder, 
  Star, 
  Clock, 
  Trash2, 
  Shield, 
  Users, 
  BarChart3,
  Plus,
  HardDrive,
  FolderPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { state, getFavoriteFiles, getDeletedFiles, createFolder } = useApp();
  
  const favoriteCount = getFavoriteFiles().length;
  const deletedCount = getDeletedFiles().length;
  const totalFiles = state.files.filter(f => !f.isDeleted).length;
  const totalSize = state.files
    .filter(f => !f.isDeleted && f.size)
    .reduce((acc, f) => acc + (f.size || 0), 0);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name && name.trim()) {
      createFolder(name.trim());
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
    { id: 'folders', icon: Folder, label: 'My Folders', badge: totalFiles.toString() },
    { id: 'favorites', icon: Star, label: 'Favorites', badge: favoriteCount > 0 ? favoriteCount.toString() : null },
    { id: 'recent', icon: Clock, label: 'Recent', badge: null },
    { id: 'shared', icon: Users, label: 'Shared', badge: '3' },
    { id: 'trash', icon: Trash2, label: 'Trash', badge: deletedCount > 0 ? deletedCount.toString() : null },
  ];

  const securityItems = [
    { id: 'security', icon: Shield, label: 'Security Center', badge: null },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6 space-y-3">
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Upload</span>
        </button>
        
        <button 
          onClick={handleNewFolder}
          className="w-full bg-gray-100 text-gray-700 rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all duration-200"
        >
          <FolderPlus className="w-4 h-4" />
          <span className="font-medium">New Folder</span>
        </button>
      </div>

      <nav className="px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 mt-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Security & Admin
        </h3>
        <nav className="space-y-1">
          {securityItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="px-4 mt-8 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <HardDrive className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Storage</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className="font-medium text-gray-900">{formatSize(totalSize)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatSize(totalSize)} used</span>
              <span>{formatSize(10 * 1024 * 1024 * 1024 - totalSize)} free</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};