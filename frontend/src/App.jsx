import {useState} from 'react'
import LandingPage from './pages/LandingPage';
import GuestPage from './pages/GuestPage';
import ErrorPage from './pages/ErrorPage';
import { Routes , Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';


function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/user-auth' element={<Authentication />} />
        <Route path='/guest' element={<GuestPage />} />
        <Route path='/dashboard' element={<Dashboard />} />


        {/* error-page for unrecognized url parameters */}
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App