import { motion } from "framer-motion";
import { Upload, MapPin, Home, DollarSign, Calendar, Phone, EyeOff, Info, Check, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAds } from "../context/AdsContext";

export const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ads, updateAd } = useAds();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [hasServices, setHasServices] = useState(false);
  const [hasWarranty, setHasWarranty] = useState(false);
  const [hidePhone, setHidePhone] = useState(false);

  useEffect(() => {
    // Pre-fill data if editing an existing ad
    if (id) {
      const room = ads.find((r: any) => r.id === id || r.id === Number(id));
      if (room) {
        setTitle(room.title || "");
        setDescription(room.description || "");
        setPrice(room.price?.toString() || "");
        setLocation(room.district || room.location || ""); // Adaptado a columna 'district'
        setRoomType(room.room_type || room.roomType || room.type || ""); // Adaptado a columna 'room_type'
        setHasServices(room.services ? room.services.length > 0 : (room.servicesIncluded || false));
        setHasWarranty(room.guarantee ? room.guarantee !== 'Sin garantía' : (room.warranty || false));
      }
    }
  }, [id, ads]);

  const amenitiesList = [
    "Agua Caliente", "Internet Alta Velocidad", "TV por Cable", "Aire Acondicionado", 
    "Calefacción", "Ascensor", "Recepción 24/7", "Gimnasio", "Piscina", "Zona de Parrillas", 
    "Estacionamiento", "Bicicletero", "Áreas Verdes", "Zona de Juegos", "Coworking", 
    "Sala de Reuniones", "Lavandería Común", "Secadora", "Balcón", "Terraza", 
    "Pet Friendly", "Cámaras de Seguridad"
  ];

  const commonAreasList = ["Cocina", "Lavandería", "Sala", "Comedor"];
  const servicesList = ["Agua", "Luz", "Wi-Fi", "Gas Natural", "Mantenimiento"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateAd(Number(id), {
        title,
        description,
        price: Number(price),
        district: location, // Corregido el mapeo
        room_type: roomType, // Corregido el mapeo
        servicesIncluded: hasServices,
        warranty: hasWarranty,
      });
    }
    // Simulate saving and redirecting back
    navigate('/mis-anuncios');
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link to="/mis-anuncios" className="flex items-center space-x-2 text-white/60 hover:text-white mb-6 transition-colors w-max">
          <ArrowLeft size={20} />
          <span>Volver a Mis Anuncios</span>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Editar Anuncio</h1>
          <p className="text-white/60">Actualiza los detalles de tu publicación.</p>
        </div>

        <form className="space-y-8" onSubmit={handleSave}>
          
          {/* 1. Multimedia */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="text-fuchsia-500" />
              <h2 className="text-2xl font-bold">Multimedia</h2>
            </div>
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-fuchsia-500/20 text-fuchsia-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <p className="font-medium text-lg mb-1">Sube hasta 8 fotos</p>
              <p className="text-white/40 text-sm">Arrastra las imágenes aquí o haz clic para buscar</p>
              <p className="text-white/30 text-xs mt-4">Formatos soportados: JPG, PNG. Máx 5MB por foto.</p>
            </div>
          </motion.section>

          {/* 2. Detalles Principales */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Info className="text-fuchsia-500" />
              <h2 className="text-2xl font-bold">Detalles Principales</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Título del anuncio</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Habitación luminosa en Miraflores" 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Descripción</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el lugar, el ambiente y lo que buscas en un inquilino..." 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Precio Mensual (S/)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00" 
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
              </div>

              {/* Lógica de Servicios */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-center space-x-3 cursor-pointer mb-4">
                  <input 
                    type="checkbox" 
                    checked={hasServices}
                    onChange={(e) => setHasServices(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" 
                  />
                  <span className="font-medium">Servicios incluidos en el precio</span>
                </label>
                
                {hasServices && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-8">
                    {servicesList.map(service => (
                      <label key={service} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" />
                        <span className="text-sm text-white/70">{service}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Lógica de Garantía */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-center space-x-3 cursor-pointer mb-4">
                  <input 
                    type="checkbox" 
                    checked={hasWarranty}
                    onChange={(e) => setHasWarranty(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" 
                  />
                  <span className="font-medium">Requiere garantía</span>
                </label>
                
                {hasWarranty && (
                  <div className="pl-8 w-full md:w-1/2">
                    <label className="block text-sm font-medium text-white/60 mb-2">Monto de Garantía (S/)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input type="number" placeholder="0.00" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* 3. Especificaciones */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Home className="text-fuchsia-500" />
              <h2 className="text-2xl font-bold">Especificaciones</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Tipo de habitación</label>
                <select 
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Monoambiente">Monoambiente</option>
                  <option value="Independiente">Independiente</option>
                  <option value="Roommate">Roommate (Compartido)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Dirigido a</label>
                <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                  <option value="cualquiera">Cualquiera</option>
                  <option value="hombres">Solo Hombres</option>
                  <option value="mujeres">Solo Mujeres</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Baño</label>
                <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                  <option value="">Seleccionar...</option>
                  <option value="privado">Privado</option>
                  <option value="compartido">Compartido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Estado</label>
                <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                  <option value="">Seleccionar...</option>
                  <option value="amoblado">Amoblado</option>
                  <option value="sin_amoblar">Sin amoblar</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* 4. Ubicación */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-fuchsia-500" />
              <h2 className="text-2xl font-bold">Ubicación</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Dirección exacta</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Av. Larco 123" 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Departamento</label>
                  <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                    <option value="lima">Lima</option>
                    {/* Add more departments if needed */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Ciudad / Provincia</label>
                  <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                    <option value="lima">Lima</option>
                    {/* Add more cities */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Distrito</label>
                  <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-fuchsia-500 outline-none transition-colors appearance-none">
                    <option value="">Seleccionar...</option>
                    <option value="miraflores">Miraflores</option>
                    <option value="barranco">Barranco</option>
                    <option value="san_isidro">San Isidro</option>
                    <option value="surco">Surco</option>
                    <option value="lince">Lince</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 5. Áreas Comunes y Comodidades */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Check className="text-fuchsia-500" />
              <h2 className="text-2xl font-bold">Áreas Comunes y Comodidades</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Áreas Comunes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {commonAreasList.map(area => (
                    <label key={area} className="flex items-center space-x-3 p-4 rounded-xl border border-white/10 bg-[#1a1a1a] cursor-pointer hover:border-fuchsia-500/50 transition-colors">
                      <input type="checkbox" className="rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" />
                      <span className="text-sm font-medium">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" />
                      <span className="text-sm text-white/70">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 6. Contacto */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="text-fuchsia-500" />
              <h2 className="text-2xl font-bold">Contacto y Disponibilidad</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Fecha de disponibilidad</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="date" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Número de Celular</label>
                <div className="relative mb-3">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="tel" placeholder="+51 999 999 999" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-fuchsia-500 outline-none transition-colors" />
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={hidePhone}
                      onChange={(e) => setHidePhone(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${hidePhone ? 'bg-fuchsia-500' : 'bg-white/20'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hidePhone ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-sm text-white/60 flex items-center">
                    <EyeOff size={14} className="mr-1" /> Ocultar número en el anuncio
                  </span>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 pb-10">
            <button type="submit" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-fuchsia-500/20 text-lg">
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};