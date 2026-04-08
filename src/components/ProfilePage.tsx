import { motion } from "motion/react";
import { Shield, Camera, Save, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Usar el contexto real

export const ProfilePage = () => {
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?u=me");

  // Extraer el nombre del metadata de Supabase o usar el email si no hay nombre
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario";

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Tu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar - Photo & Verification */}
          <div className="md:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-fuchsia-500/20 to-transparent"></div>
              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-white/10 rounded-full border-4 border-black mb-4 overflow-hidden relative group cursor-pointer">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-xs font-medium text-white">Cambiar foto</span>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <h2 className="text-xl font-bold">{userName}</h2>
                <p className="text-white/60 text-sm mb-4">Miembro activo</p>
                <div className="flex items-center justify-center space-x-2 text-fuchsia-500 text-sm font-medium bg-fuchsia-500/10 py-1.5 px-3 rounded-full w-max mx-auto">
                  <Shield size={14} />
                  <span>Identidad Verificada</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content - Form */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Información Personal</h3>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombres */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      defaultValue={userName}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                    />
                  </div>
                  
                  {/* Correo (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={user?.email || ""}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/40 outline-none" 
                    />
                  </div>

                  {/* Edad */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Edad</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 33"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Sexo</label>
                    <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                      <option value="">Seleccionar...</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                      <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                    </select>
                  </div>
                </div>

                {/* Acerca de mí */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Acerca de mí</label>
                  <textarea 
                    rows={5}
                    placeholder="Cuéntanos un poco sobre ti..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors resize-none" 
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-fuchsia-500/20">
                    <Shield size={18} />
                    <span>Verificar con DNI</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};