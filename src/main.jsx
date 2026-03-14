import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css' // Cargamos Tailwind
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { NotificationProvider } from './pages/Notification/NotificationContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <NotificationProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </NotificationProvider>
  </AuthProvider>
);