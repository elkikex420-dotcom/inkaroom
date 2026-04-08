import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Importación de todos los proveedores necesarios
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AdsProvider } from './context/AdsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AdsProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AdsProvider>
    </AuthProvider>
  </React.StrictMode>
);