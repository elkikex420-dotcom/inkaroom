import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, ArrowLeft, Star, Heart, Share2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // EFECTO DE CARGA: Busca el anuncio por ID en Supabase al cargar o refrescar
  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single(); // Trae un solo resultado
      
      if (!error && data) {
        setRoom(data);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="animate-spin text-fuchsia-500" size={40} />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40 italic">Cargando habitación...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center font-sans selection:bg-fuchsia-500/30">
        <h2 className="text-3xl font-black mb-4 text-fuchsia-500 italic uppercase tracking-tighter text-white ledaning-none">¡Ups! No existe</h2>
        <p className="text-white/40 mb-10 text-xs font-black uppercase tracking-widest">Este anuncio ya no está disponible o el enlace es incorrecto.</p>
        <button onClick={() => navigate("/buscar")} className="bg-white text-black px-10 py-4 rounded-full transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-white/5">Volver a buscar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 font-sans selection:bg-fuchsia-500/30">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="font-black text-[9px] uppercase tracking-[0.3em] text-white/70">Regresar</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="aspect-video rounded-[3rem] overflow-hidden border border-white/5 mb-12 group relative">
              {/* CAMBIO DE IMAGEN: Usamos 'room.images?.[0]' para la columna 'images' */}
              <img src={room.images?.[0] || 'https://via.placeholder.com/1200x675'} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute top-8 right-8 flex gap-4">
                <button className="w-14 h-14 bg-black/70 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center hover:bg-fuchsia-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/30"><Heart size={20} /></button>
                <button className="w-14 h-14 bg-black/70 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/30"><Share2 size={20} /></button>
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-fuchsia-500/10 text-fuchsia-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-fuchsia-500/20 italic">Premium</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-fuchsia-500 text-fuchsia-500" />)}
              </div>
              <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">4.9 Valoración</span>
              <span className="text-white/10">|</span>
              <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Lima</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-12 text-white leading-none">{room.title}</h1>
            
            <div className="prose prose-invert max-w-none border-t border-white/5 pt-12">
              <p className="text-white/60 leading-relaxed text-xl mb-12">{room.description}</p>
            </div>
          </div>

          <div className="lg:col-span-4 relative z-10">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 sticky top-32 shadow-2xl shadow-black/30">
              <div className="flex items-end justify-between mb-8 pb-8 border-b border-white/5">
                <div className="flex-1">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Costo mensual</p>
                  {/* ALINEACIÓN: Usamos 'room.price' para la columna 'price' */}
                  <div className="text-4xl font-display font-bold text-fuchsia-500 italic">S/ {room.price}</div>
                </div>
              </div>

              <div className="space-y-5 mb-10 text-center">
                <div className="flex items-center justify-center gap-3 text-white">
                  <MapPin size={18} className="text-fuchsia-500" />
                  {/* ALINEACIÓN: Usamos 'room.district' para la columna 'district' */}
                  <span className="text-sm font-bold">{room.district}, Lima</span>
                </div>
              </div>

              <button className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-fuchsia-500/20 transition-all uppercase tracking-widest text-xs mb-4 active:scale-95 disabled:bg-fuchsia-500/50">
                Contactar al Propietario
              </button>
              <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest italic pt-2">Verificado por Inkaroom</p>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-fuchsia-600/10 to-blue-600/10 blur-[200px] rounded-full -z-10 pointer-events-none"></div>
      </div>
    </div>
  );
};