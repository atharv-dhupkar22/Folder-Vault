import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UploadZone: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFiles } = useApp();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    try {
      uploadFiles(files);
      setUploadStatus('success');
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return `Uploading files... ${Math.round(uploadProgress)}%`;
      case 'success':
        return 'Files uploaded successfully!';
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return 'Drag & drop files here or click to browse';
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : uploadStatus === 'success'
          ? 'border-green-500 bg-green-50'
          : uploadStatus === 'error'
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      
      <div className="flex flex-col items-center space-y-4">
        {getStatusIcon()}
        
        <div className="space-y-2">
          <p className={`text-lg font-medium ${
            uploadStatus === 'success' ? 'text-green-700' : 
            uploadStatus === 'error' ? 'text-red-700' : 
            'text-gray-700'
          }`}>
            {getStatusMessage()}
          </p>
          
          {uploadStatus === 'idle' && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Upload up to 10 files at once
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, DOC, JPG, PNG, MP4, ZIP (Max 100MB each)
              </p>
            </div>
          )}
        </div>

        {uploadStatus === 'idle' && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Browse Files
          </button>
        )}
      </div>

      {uploadStatus === 'uploading' && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};