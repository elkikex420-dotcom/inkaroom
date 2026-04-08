import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, ArrowRight, Facebook, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase"; // Importación necesaria

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error al iniciar sesión: " + error.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      login(); // Actualiza el estado global
      navigate('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      alert("Error en el registro: " + error.message);
      setIsLoading(false);
    } else {
      alert("¡Registro exitoso! Revisa tu correo para confirmar.");
      setIsLoading(false);
      setView('login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black flex items-center justify-center px-6 py-12 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Bienvenido de vuelta</h1>
              <p className="text-white/60">Ingresa a tu cuenta en INKAROOM</p>
            </div>

            {/* Social Login Buttons - Mantener igual */}
            <div className="space-y-4 mb-8">
              <button 
                type="button"
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Iniciar sesión con Google</span>
              </button>
              
              <button 
                type="button"
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                <Facebook className="w-5 h-5" />
                <span>Iniciar sesión con Facebook</span>
              </button>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-4 text-sm text-white/40">O ingresa con tu correo</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" 
                  />
                  <span className="text-white/60">Recordarme</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="text-fuchsia-500 hover:text-fuchsia-400 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-fuchsia-500/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Iniciar Sesión con Email</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-white/60 mt-8 text-sm">
              ¿No tienes una cuenta?{' '}
              <button onClick={() => setView('register')} className="text-fuchsia-500 hover:text-fuchsia-400 font-medium">
                Regístrate
              </button>
            </p>
          </motion.div>
        )}

        {view === 'register' && (
          <motion.div 
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
          >
            <button 
              onClick={() => setView('login')}
              className="text-white/60 hover:text-white mb-6 flex items-center text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Volver
            </button>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Crea tu cuenta</h1>
              <p className="text-white/60">Únete a INKAROOM hoy mismo</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-fuchsia-500/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Registrarse</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {view === 'forgot' && (
          <motion.div 
            key="forgot"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
          >
            <button 
              onClick={() => setView('login')}
              className="text-white/60 hover:text-white mb-6 flex items-center text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Volver al login
            </button>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Recuperar Contraseña</h1>
              <p className="text-white/60">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
            </div>
            
            <form className="space-y-6" onSubmit={async (e) => { 
              e.preventDefault(); 
              await supabase.auth.resetPasswordForEmail(email);
              alert("Correo de recuperación enviado.");
              setView('login'); 
            }}>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-fuchsia-500/20"
              >
                Enviar enlace
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};