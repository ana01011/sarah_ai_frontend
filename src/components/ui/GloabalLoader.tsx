import React from 'react';
import { Loader2 } from 'lucide-react';

export const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50">
      {/* Brand Name / Logo */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900">
          AMESIE
        </h1>
        <p className="text-sm font-medium text-slate-500 tracking-widest mt-2 uppercase">
          Seller Dashboard
        </p>
      </div>

      {/* Modern Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-slate-200"></div>
        {/* Inner Spinner */}
        <Loader2 
          className="w-12 h-12 animate-spin text-amber-500 relative z-10" 
          strokeWidth={2.5}
        />
      </div>
      
      {/* Optional: Loading Status Text */}
      <p className="mt-6 text-sm font-medium text-slate-400 animate-pulse">
        Initializing Workspace...
      </p>
    </div>
  );
};