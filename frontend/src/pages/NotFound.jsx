import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-full mb-6">
        <FiAlertCircle className="w-12 h-12 animate-bounce" />
      </div>
      <h2 className="font-heading font-extrabold text-4xl text-slate-900 tracking-tight">Page Not Found</h2>
      <p className="text-slate-500 text-sm mt-3 max-w-sm leading-relaxed">
        The page you are looking for does not exist or has been moved. Check the URL or click below to return to the workspace.
      </p>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-premium text-sm"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Safety
      </Link>
    </div>
  );
};

export default NotFound;
