import React, { useState } from 'react';
import { Grid, List, Filter, SortAsc } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FileGrid } from './components/FileGrid';
import { UploadZone } from './components/UploadZone';
import { StatsCards } from './components/StatsCards';
import { RecentActivity } from './components/RecentActivity';
import { Breadcrumb } from './components/Breadcrumb';

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { 
    state, 
    setViewMode, 
    getFilesByPath, 
    getFavoriteFiles, 
    getRecentFiles, 
    getDeletedFiles 
  } = useApp();

  if (!state.user) {
    return <LoginForm />;
  }

  const getFilteredFiles = () => {
    let files;
    
    switch (activeSection) {
      case 'favorites':
        files = getFavoriteFiles();
        break;
      case 'recent':
        files = getRecentFiles();
        break;
      case 'trash':
        files = getDeletedFiles();
        break;
      default:
        files = getFilesByPath(state.currentPath);
        break;
    }

    if (state.searchQuery) {
      files = files.filter(file =>
        file.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    return files;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Overview of your secure file vault</p>
            </div>
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <UploadZone />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        );
      
      default:
        const filteredFiles = getFilteredFiles();
        const showDeleted = activeSection === 'trash';
        
        return (
          <div className="space-y-6">
            {activeSection === 'folders' && <Breadcrumb />}
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
                <p className="text-gray-600">
                  {filteredFiles.length} item{filteredFiles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <SortAsc className="w-4 h-4" />
                  <span>Sort</span>
                </button>
                
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${state.viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${state.viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {filteredFiles.length > 0 ? (
              <FileGrid files={filteredFiles} showDeleted={showDeleted} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {state.searchQuery ? (
                    <p>No files found matching "{state.searchQuery}"</p>
                  ) : (
                    <p>No files in this section yet</p>
                  )}
                </div>
                {!state.searchQuery && activeSection === 'folders' && (
                  <p className="text-sm text-gray-500">Upload some files to get started</p>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;