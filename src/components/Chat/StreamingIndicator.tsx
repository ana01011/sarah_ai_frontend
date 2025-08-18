import React from 'react';

export const StreamingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl p-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">S</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
        <span className="text-sm text-gray-600">Sarah is thinking...</span>
      </div>
    </div>
  );
};