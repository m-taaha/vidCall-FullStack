import React from 'react'
import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({children}) => {
    const {user, loading} = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* A simple CSS spinner */}
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">
              Securing session...
            </p>
          </div>
        </div>
      );
    }
    if(!user) {
        return <Navigate to="/user-auth" replace />
    }
    
    return children;
};


export default ProtectedRoute;