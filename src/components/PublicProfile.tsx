import { motion } from "motion/react";
import { User, MapPin, Shield, Star, MessageSquare, Briefcase, GraduationCap, Calendar } from "lucide-react";
import { useParams, Link } from "react-router-dom";

export const PublicProfile = () => {
  const { id } = useParams();
  
  // Simulated user data based on ID
  const user = {
    id,
    firstName: id === '1' ? "Ana" : id === '2' ? "Carlos" : "Elena",
    lastName: id === '1' ? "García" : id === '2' ? "Ruiz" : "Torres",
    age: id === '1' ? 28 : id === '2' ? 32 : 25,
    occupation: id === '1' ? "Trabajador dependiente" : id === '2' ? "Trabajador Independiente" : "Estudiante",
    profession: id === '1' ? "Arquitecta" : id === '2' ? "Diseñador Gráfico" : "Medicina",
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    memberSince: "2022",
    location: "Lima, Perú",
    about: "Hola, soy una persona tranquila y ordenada. Busco un lugar acogedor para vivir y trabajar. Me gusta mantener las áreas comunes limpias y respeto mucho la privacidad de los demás. En mi tiempo libre disfruto leer, salir a correr y visitar cafeterías.",
    listings: 2,
    rating: 4.8
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black px-6 py-10">
      <div className="max-w-4xl mx-auto">
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
                <div className="w-32 h-32 mx-auto bg-white/10 rounded-full border-4 border-black mb-4 overflow-hidden">
                  <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-white/60 text-sm mb-4">Miembro desde {user.memberSince}</p>
                <div className="flex items-center justify-center space-x-2 text-fuchsia-500 text-sm font-medium bg-fuchsia-500/10 py-1.5 px-3 rounded-full w-max mx-auto mb-6">
                  <Shield size={14} />
                  <span>Identidad Verificada</span>
                </div>
                
                {id === 'me' ? (
                  <Link 
                    to="/perfil"
                    className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <User size={18} />
                    <span>Editar Perfil</span>
                  </Link>
                ) : (
                  <Link 
                    to="/mensajes"
                    className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-fuchsia-500/20"
                  >
                    <MessageSquare size={18} />
                    <span>Enviar Mensaje</span>
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <h3 className="font-bold mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Anuncios publicados</span>
                  <span className="font-bold">{user.listings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Calificación</span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star size={14} className="fill-yellow-400" />
                    <span className="font-bold text-white">{user.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Acerca de {user.firstName}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-fuchsia-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Edad</p>
                    <p className="font-medium">{user.age} años</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-fuchsia-500">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Ocupación</p>
                    <p className="font-medium">{user.occupation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-fuchsia-500">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Profesión</p>
                    <p className="font-medium">{user.profession}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-fuchsia-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Ubicación</p>
                    <p className="font-medium">{user.location}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="font-bold mb-4">Descripción personal</h4>
                <p className="text-white/70 leading-relaxed">
                  {user.about}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
