import { motion } from "framer-motion";
import { Camera, MapPin, DollarSign, Info, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useAds } from "../context/AdsContext";

export const PublishPage = () => {
  const { user } = useAuth();
  const { addAd } = useAds();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image_url: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // MANEJO DE SUBIDA DE IMAGEN
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('room-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      nextStep();
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("No se pudo subir la imagen. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // FINALIZAR Y GUARDAR EN TABLA 'listings'
  const handleFinalize = async () => {
    if (!user || !formData.image_url) return;

    try {
      setLoading(true);
      const newListing = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        district: formData.location, // Mapeo a columna 'district'
        images: [formData.image_url], // Mapeo a columna 'images' como arreglo
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('listings')
        .insert([newListing])
        .select();

      if (error) throw error;

      // VALIDACIÓN ESTRICTA: Asegura que data es enviado correctamente a addAd sin causar bloqueos
      if (data && Array.isArray(data) && data.length > 0) {
        addAd(data[0]);
      } else if (data && typeof data === 'object') {
        addAd(data);
      }
      
      window.location.href = '/mis-anuncios';
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un error al guardar el anuncio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6 font-sans selection:bg-fuchsia-500/30">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Publica tu Habitación</h1>
          <p className="text-white/40 mt-3 text-sm">Comparte tu espacio con la comunidad de INKAROOM.</p>
        </div>

        <div className="flex items-center justify-between mb-16 max-w-sm mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center last:flex-initial">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-all ${step >= s ? 'bg-fuchsia-500 border-fuchsia-500 text-white' : 'border-white/10 text-white/20'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-20 md:w-28 h-0.5 ${step > s ? 'bg-fuchsia-500' : 'bg-white/10'}`}></div>}
            </div>
          ))}
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/40 relative z-10">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic uppercase tracking-tighter text-white leading-none">
                <Info className="text-fuchsia-500" size={20} /> Información Básica
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-black text-white/30 uppercase tracking-widest mb-3 ml-2">Título del Anuncio</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Habitación moderna en Miraflores" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-fuchsia-500 outline-none placeholder:text-white/10" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-white/30 uppercase tracking-widest mb-3 ml-2">Descripción</label>
                  <textarea 
                    rows={4} 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe los detalles, servicios incluidos y a tu roomie ideal..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-fuchsia-500 outline-none resize-none placeholder:text-white/10 leading-relaxed"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-black text-white/30 uppercase tracking-widest mb-3 ml-2">Precio Mensual (S/)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-black text-xl focus:border-fuchsia-500 outline-none placeholder:text-white/10 italic" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-white/30 uppercase tracking-widest mb-3 ml-2">Distrito</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Distrito, Lima" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white focus:border-fuchsia-500 outline-none placeholder:text-white/10 font-medium" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic uppercase tracking-tighter text-white leading-none">
                <Camera className="text-fuchsia-500" size={20} /> Fotos y Galería
              </h2>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
              <div 
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-white/10 rounded-3xl p-16 text-center transition-all cursor-pointer group ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-fuchsia-500/50 hover:bg-white/5'}`}
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:scale-105 group-hover:bg-fuchsia-500/10 transition-all shadow-inner shadow-black/20">
                  {loading ? (
                    <Loader2 className="animate-spin text-fuchsia-500" size={28} />
                  ) : (
                    <Camera size={28} className="text-white/10 group-hover:text-fuchsia-500 transition-colors" />
                  )}
                </div>
                <p className="text-xs font-black uppercase text-white/70 mb-2 tracking-widest">Sube tu foto principal</p>
                <p className="text-white/20 text-[10px] font-medium tracking-widest uppercase">Haz clic para seleccionar archivo</p>
              </div>
              
              {formData.image_url && (
                <div className="mt-12 flex justify-center">
                  <img src={formData.image_url} alt="Preview" className="w-48 aspect-[4/3] object-cover rounded-2xl border border-white/10 shadow-lg shadow-black/20" />
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-10">
              <div className="w-20 h-20 bg-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-fuchsia-500/30">
                <CheckCircle2 size={40} className="text-fuchsia-500" />
              </div>
              <h2 className="text-3xl font-black mb-4 italic uppercase tracking-tighter text-white">¡PUBLICADO!</h2>
              <p className="text-white/40 mb-10 text-sm font-bold">Tu anuncio ya está disponible en el buscador.</p>
              
              <button onClick={() => window.location.href = '/mis-anuncios'} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs hover:bg-fuchsia-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
                VER MIS ANUNCIOS
              </button>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-16 pb-4 relative z-10">
            {step > 1 && step < 3 && (
              <button onClick={prevStep} className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white/70 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Regresar</button>
            )}
            <div className="flex-1"></div>
            {step === 1 && (
              <button 
                onClick={nextStep} 
                className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-10 py-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-fuchsia-500/20 active:scale-95"
              >
                Siguiente
              </button>
            )}
            
            {step === 2 && (
              <button 
                onClick={handleFinalize} 
                disabled={loading || !formData.image_url}
                className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-10 py-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-fuchsia-500/20 active:scale-95 disabled:bg-fuchsia-500/50 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />} Finalizar
              </button>
            )}
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-fuchsia-600/10 to-blue-600/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};