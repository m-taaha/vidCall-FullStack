import {useState} from 'react'
import LandingPage from './pages/LandingPage';
import GuestPage from './pages/GuestPage';
import ErrorPage from './pages/ErrorPage';
import { Routes , Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import GreenRoom from './pages/GreenRoom';
import MeetingRoom from './pages/MeetingRoom';


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-auth" element={<Authentication />} />
        <Route path="/guest" element={<GuestPage />} />

        {/* Protect the Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route 
        path="/green-room/:id" 
        element={<GreenRoom />} />


        <Route 
        path="/meeting-room/:id" 
        element={<MeetingRoom />} />

        {/* error-page for unrecognized url parameters */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App