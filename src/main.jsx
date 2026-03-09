import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css' // Cargamos Tailwind
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>,
  </AuthProvider>
);