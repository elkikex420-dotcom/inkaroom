import { motion } from "motion/react";
import { MapPin, Star, Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { roomsData } from "../data/rooms";

export const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  
  const favoriteRooms = roomsData.filter(room => favorites.includes(room.id));

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-2">Tus Favoritos</h1>
        <p className="text-white/60 mb-12">Lugares que has guardado para ver más tarde.</p>

        {favoriteRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteRooms.map((room, idx) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-fuchsia-500/50 transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(room.id); }}
                      className="bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <Heart size={18} className="text-fuchsia-500 fill-fuchsia-500" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-white/10">
                    S/ {room.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-fuchsia-500 transition-colors">{room.title}</h3>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star size={14} className="fill-yellow-400" />
                      <span className="text-sm font-bold">{room.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-white/40 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {room.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-white/5 rounded-md text-white/60 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white/5 border border-white/10 rounded-3xl">
            <Heart size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Aún no tienes favoritos</h3>
            <p className="text-white/40">Guarda las habitaciones que más te gusten haciendo clic en el corazón.</p>
          </div>
        )}
      </div>
    </div>
  );
};
