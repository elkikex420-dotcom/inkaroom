import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Zap, Users, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from "framer-motion";

export const Home = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado local independiente. NO usamos el del context para evitar que se borre.
  const [featuredAds, setFeaturedAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .limit(3);
        
        if (error) throw error;
        if (data) {
          setFeaturedAds(data);
        }
      } catch (err) {
        console.error("Error cargando anuncios destacados:", err);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!searchQuery.trim()) return;
    navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleCardClick = (id: string) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/room/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuchsia-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex flex-col items-center">
            
          <h1 className="text-[15vw] md:text-[180px] lg:text-[220px] font-black italic tracking-[-0.08em] leading-[0.8] mb-4 text-white uppercase select-none">
          <span className="brand-name notranslate" translate="no">INKAROOM</span>
          </h1>

            <p className="text-2xl md:text-5xl font-black italic tracking-tighter mb-16 max-w-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-blue-500 uppercase leading-tight">
                Encuentra tu próximo hogar
              </span>
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl w-full mx-auto group relative">
              <div className="flex items-center bg-[#080808] border border-white/10 rounded-full px-6 py-2.5 transition-all group-focus-within:border-fuchsia-500/50 shadow-2xl relative z-10">
                <Search size={20} className="text-white/20 group-focus-within:text-fuchsia-500 transition-colors" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="¿Dónde quieres vivir?"
                  className="w-full bg-transparent border-none focus:ring-0 py-4 px-4 text-lg text-white placeholder:text-white/10 font-bold italic outline-none"
                />
                 <button type="submit" className="bg-white text-black px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-fuchsia-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
                 <span className="notranslate" translate="no">BUSCAR</span>
                 </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 to-blue-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full z-0"></div>
            </form>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 w-full hidden md:block z-0">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center opacity-60">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-fuchsia-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-white/70">Seguridad</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="text-fuchsia-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-white/70">Comunidad</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="text-fuchsia-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-white/70">Rapidez</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Anuncios Destacados */}
      <section className="py-32 px-6 bg-black border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20 gap-8">
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Destacados</h2>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mt-2 ml-1 text-fuchsia-500">Lima / 2026</p>
            </div>
            <Link to="/buscar" className="text-white/40 hover:text-fuchsia-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all">
              VER CATÁLOGO <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {featuredAds.map((ad: any) => (
              <div 
                key={ad.id} 
                onClick={() => handleCardClick(ad.id)}
                className="group bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden hover:border-fuchsia-500/20 transition-all cursor-pointer shadow-2xl shadow-black/30"
              >
                <div className="aspect-[4/5] overflow-hidden relative bg-[#121212]">
                  {/* MODIFICACIÓN DE IMAGEN: Usamos 'ad.images?.[0]' para la columna 'images' */}
                  <img 
                    src={ad.images?.[0] || 'https://via.placeholder.com/400x500?text=Cargando...'} 
                    alt={ad.title} 
                    className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    loading="lazy"
                  />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                    {/* MODIFICACIÓN: Usamos 'ad.price' para la columna 'price' */}
                    <span className="text-fuchsia-500 font-black italic text-base">S/ {ad.price}</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-fuchsia-500 text-[10px] font-black uppercase tracking-widest mb-3">
                    <MapPin size={14} /> {ad.district}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase leading-tight tracking-tighter group-hover:text-fuchsia-500 transition-colors text-white truncate">
                    {ad.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-600/10 to-blue-600/10 blur-[150px] rounded-full -z-10 pointer-events-none translate-y-[-50%] translate-x-[-200px]"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-fuchsia-600/10 to-blue-600/10 blur-[150px] rounded-full -z-10 pointer-events-none translate-y-[100px] translate-x-[200px]"></div>
        </div>
      </section>
    </div>
  );
};