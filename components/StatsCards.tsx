import React from 'react';
import { Files, Shield, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StatsCards: React.FC = () => {
  const { state } = useApp();
  
  const totalFiles = state.files.filter(f => !f.isDeleted).length;
  const secureFiles = state.files.filter(f => !f.isDeleted && f.isSecure).length;
  const sharedFiles = state.files.filter(f => !f.isDeleted && f.type === 'file').length; // Simplified for demo
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

  const stats = [
    {
      title: 'Total Files',
      value: totalFiles.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Files,
      color: 'blue'
    },
    {
      title: 'Secure Files',
      value: secureFiles.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: Shield,
      color: 'green'
    },
    {
      title: 'Shared Files',
      value: Math.floor(sharedFiles * 0.3).toString(), // Demo calculation
      change: '+3%',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Storage Used',
      value: formatSize(totalSize),
      change: '24%',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'orange':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};