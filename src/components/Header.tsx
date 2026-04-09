import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Plus, User, LogOut, ChevronDown, List, BellOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { isLoggedIn, user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // PASO 4: Limpieza de notificaciones de ejemplo
  const notifications: any[] = [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      // Llamamos a la función del contexto que ya incluye el signOut de Supabase
      await signOut();
      
      // Limpiamos todo rastro de sesión local
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirección forzada para limpiar el estado de la App
      window.location.href = '/'; 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-fuchsia-600 to-blue-600 rounded-lg flex items-center justify-center font-black text-white italic">I</div>
          <span className="font-display font-bold text-xl tracking-tighter text-white uppercase">
                <span className="brand-name notranslate" translate="no">INKAROOM</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/publicar" className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-fuchsia-500 hover:text-white transition-all">
                <Plus size={18} /> Publicar
              </Link>
              <Link to="/mensajes" className="p-2 text-white/70 hover:text-white transition-colors"><MessageSquare size={22} /></Link>
              
              <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-white/70 hover:text-white transition-colors relative">
                  <Bell size={22} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500 rounded-full border border-black"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 font-bold text-sm text-fuchsia-500 uppercase tracking-widest text-[10px]">Notificaciones</div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar bg-black/20">
                      {notifications.length > 0 ? (
                        notifications.map((n, index) => (
                          <div key={index} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                            <p className="text-[11px] font-bold text-white mb-1">Nueva respuesta a tu anuncio</p>
                            <p className="text-[10px] text-white/40">Reciente</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                          <BellOff size={24} className="text-white/10" />
                          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Sin notificaciones nuevas</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 pl-2 border-l border-white/10 group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                        <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : ( <User size={18} className="text-white" /> )}
                    </div>
                  </div>
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-2">
                    <Link to="/perfil" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm text-white/80"><User size={18} className="text-fuchsia-500" /> Mi Perfil</Link>
                    <Link to="/mis-anuncios" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm text-white/80"><List size={18} className="text-fuchsia-500" /> Mis Anuncios</Link>
                    <div className="h-[1px] bg-white/5 my-2" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 text-sm font-medium"><LogOut size={18} /> Cerrar Sesión</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg shadow-white/5">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
};