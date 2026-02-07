import React from 'react'
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[40vw] font-extrabold text-white/5 select-none">
          404
        </span>
      </div>


      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Tag */}
        <span className="mb-4 inline-block bg-blue-600/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full rotate-12">
          Page Not Found
        </span>


        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Oops! You’re lost
        </h1>


        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you’re looking for doesn’t exist or may have been moved.
          Don’t worry — let’s get you back on track.
        </p>


        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage