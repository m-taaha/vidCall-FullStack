import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { MeetingContext, MeetingContextProvider } from './context/MeetingContext.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <MeetingContextProvider>
          <App />
        </MeetingContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
