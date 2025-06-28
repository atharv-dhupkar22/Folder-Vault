import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Breadcrumb: React.FC = () => {
  const { state, setCurrentPath } = useApp();
  
  const pathParts = state.currentPath.split('/').filter(Boolean);
  
  const handlePathClick = (index: number) => {
    if (index === -1) {
      setCurrentPath('/');
    } else {
      const newPath = '/' + pathParts.slice(0, index + 1).join('/');
      setCurrentPath(newPath);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <button
        onClick={() => handlePathClick(-1)}
        className="flex items-center space-x-1 hover:text-gray-900 transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      
      {pathParts.map((part, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => handlePathClick(index)}
            className="hover:text-gray-900 transition-colors duration-200"
          >
            {part}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};