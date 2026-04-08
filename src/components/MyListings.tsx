import React, { useEffect, useState } from 'react';
import { Plus, Home, MapPin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export const MyListings = () => {
  const { user } = useAuth();
  const [myAds, setMyAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar anuncios desde Supabase
  const fetchMyAds = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id); // Filtramos por tu ID de usuario

    if (!error && data) {
      setMyAds(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyAds();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este anuncio?')) {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setMyAds(myAds.filter(ad => ad.id !== id));
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tighter mb-2 italic uppercase">
              Mis <span className="text-fuchsia-500">Anuncios</span>
            </h1>
            <p className="text-white/40 font-medium">Gestiona tus habitaciones publicadas en Jesús María y más.</p>
          </div>
          <Link to="/publicar" className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-fuchsia-500/20">
            <Plus size={18} /> Nuevo Anuncio
          </Link>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : myAds.length === 0 ? (
          <div className="border border-white/10 rounded-[2.5rem] bg-white/5 p-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <Home size={40} className="text-white/20" />
            </div>
            <h2 className="text-xl font-bold mb-2">No tienes anuncios activos</h2>
            <p className="text-white/40 max-w-sm mb-8 text-center text-sm">
              Empieza a publicar para encontrar a tu próximo roomie.
            </p>
            <Link to="/publicar" className="text-fuchsia-400 font-bold hover:text-fuchsia-300 underline underline-offset-8 transition-colors uppercase text-xs tracking-widest">
              Comenzar ahora
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myAds.map((ad: any) => (
              <div key={ad.id} className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-fuchsia-500/30 transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img src={ad.images?.[0] || 'https://via.placeholder.com/400x225'} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-fuchsia-500 uppercase border border-white/10">
                    S/ {ad.price}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-fuchsia-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                    <MapPin size={12} /> {ad.district}
                  </div>
                  <h3 className="text-xl font-black uppercase italic mb-6 truncate text-white">{ad.title}</h3>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5 text-white/60">
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(ad.id)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 rounded-xl transition-all border border-red-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};