import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import { Header } from './components/Header';
import { Home } from './components/Home';
import { SearchPage } from './components/SearchPage';
import { RoomDetail } from './components/RoomDetail';
import { CreateAd } from './components/CreateAd';
import { MyListings } from './components/MyListings';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { MessagesPage } from './components/MessagesPage';

// Contextos (Importamos AdsProvider)
import { useAuth } from './context/AuthContext';
import { AdsProvider } from './context/AdsContext';

// Protector de rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-black" />;
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    /* 1. Envolvemos TODO con AdsProvider para que la base de datos de anuncios funcione */
    <AdsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white">
          <Header />
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/room/:id" element={<RoomDetail />} />
            
            {/* Rutas Privadas */}
            <Route path="/publicar" element={
              <ProtectedRoute>
                <CreateAd />
              </ProtectedRoute>
            } />
            <Route path="/mis-anuncios" element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/mensajes" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AdsProvider>
  );
}