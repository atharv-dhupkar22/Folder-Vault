import React from 'react';
import { Clock, Download, Upload, Share2, Trash2, FolderPlus, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RecentActivity: React.FC = () => {
  const { state } = useApp();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-green-600" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-purple-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'create_folder':
        return <FolderPlus className="w-4 h-4 text-blue-600" />;
      case 'restore':
        return <RotateCcw className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload':
      case 'create_folder':
        return 'bg-blue-50 border-blue-200';
      case 'download':
      case 'restore':
        return 'bg-green-50 border-green-200';
      case 'share':
        return 'bg-purple-50 border-purple-200';
      case 'delete':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const recentActivities = state.activities.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
      </div>
      
      <div className="p-6">
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{state.user?.name || 'You'}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">Start uploading files to see activity here</p>
          </div>
        )}
        
        {recentActivities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};