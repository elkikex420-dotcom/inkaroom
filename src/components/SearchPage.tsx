import React, { useState, useEffect } from 'react';
import { Search, Filter, Lock, MapPin, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export const SearchPage = () => {
  const { isLoggedIn } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      // TABLA: listings
      const { data, error } = await supabase
        .from('listings')
        .select('*');
      if (!error && data) {
        setAds(data); 
      }
      setLoading(false);
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  const handleAction = (id?: string) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (id) {
      navigate(`/anuncio/${id}`);
    }
  };

  const filteredAds = ads.filter(ad => 
    (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     ad.district?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-20">
          <div className="flex items-center gap-6 mb-8">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
              RESULTA<span className="text-fuchsia-600">DOS</span>
            </h1>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-fuchsia-600/50 to-transparent"></div>
          </div>
          
          <div className="relative group max-w-2xl">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-fuchsia-500 transition-colors" size={24} />
            <input 
              type="text"
              placeholder="Busca por distrito o título..."
              className="w-full bg-[#121212] border border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 text-xl font-medium focus:outline-none focus:border-fuchsia-500/50 transition-all shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-[#121212] rounded-[3rem] h-[500px] animate-pulse border border-white/5"></div>
              ))
            ) : filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
                <div 
                  key={ad.id}
                  onClick={() => handleAction(ad.id)}
                  className="group bg-[#121212] border border-white/5 rounded-[3rem] overflow-hidden hover:border-fuchsia-500/30 transition-all duration-500 cursor-pointer relative"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    {/* CORREGIDO: Se lee ad.images?.[0] según la estructura de tu base de datos */}
                    <img 
                      src={ad.images?.[0] || 'https://images.unsplash.com/photo-1522770179533-24471fcdba45'} 
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-xl px-5 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                      <MapPin size={14} className="text-fuchsia-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{ad.district}</span>
                    </div>

                    <div className="absolute bottom-8 right-8 bg-fuchsia-600 px-6 py-3 rounded-2xl shadow-xl shadow-fuchsia-600/20">
                      <span className="text-sm font-black italic">S/ {ad.price}</span>
                    </div>
                  </div>

                  <div className="p-10">
                    <h3 className="text-2xl font-black italic uppercase leading-none mb-4 group-hover:text-fuchsia-500 transition-colors truncate">
                      {ad.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                      <span>{ad.room_type || 'Habitación'}</span>
                      <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-fuchsia-500" />
                        <span>Nuevo</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-white/20 text-xl font-medium">No se encontraron anuncios con esa búsqueda.</p>
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[150px] rounded-full -z-10 pointer-events-none translate-y-[-100px] translate-x-[200px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full -z-10 pointer-events-none translate-y-[100px] translate-x-[-150px]"></div>
        </div>

        {!isLoggedIn && (
          <div className="absolute inset-0 flex items-start justify-center z-30 pt-20">
            <div className="bg-[#0F0F0F] border border-white/10 p-12 rounded-[3.5rem] text-center shadow-[0_0_100px_rgba(217,70,239,0.15)] max-w-sm mx-4">
              <div className="w-20 h-20 bg-fuchsia-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-fuchsia-500/20 shadow-inner shadow-black/20">
                <Lock className="text-fuchsia-600" size={32} />
              </div>
              <h2 className="text-3xl font-black mb-4 italic uppercase tracking-tighter text-white leading-none">ACCESO VIP</h2>
              <p className="text-white/40 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
                Para ver los detalles, precios y contactar con los dueños en Inkaroom, necesitas una cuenta activa.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-fuchsia-500/20 hover:scale-[1.02] transition-all active:scale-95"
              >
                ENTRAR AHORA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};