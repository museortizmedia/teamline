import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css' // Cargamos Tailwind
import App from "./App";
import { AuthProvider } from './pages/Auth/AuthContext';
import { NotificationProvider } from './pages/Notification/NotificationContext';
import { TeamProvider } from './pages/Timeline/TeamContext';
import MaintenancePage from './pages/MaintenancePage';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <TeamProvider>
      <NotificationProvider>
        <StrictMode>
          {/*<App />*/}
          <MaintenancePage />
        </StrictMode>
      </NotificationProvider>
    </TeamProvider>
  </AuthProvider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker registrado:", reg))
      .catch((err) => console.error("Error registrando SW:", err));
  });
}