import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, CheckCircle2, ArrowLeft, Loader2, 
  Wifi, Wind, Utensils, ShieldCheck 
} from 'lucide-react';
import { useAds } from '../context/AdsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from "framer-motion";

export const CreateAd = () => {
  const navigate = useNavigate();
  const { addAd } = useAds();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]); 
  const [previews, setPreviews] = useState<string[]>([]); 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    district: 'Jesús María',
    roomType: 'Roommate',
    target: 'Cualquiera',
    bathType: 'Privado',
    guarantee: 'Sin garantía',
    services: [] as string[]
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id) 
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      let imageUrl = '';

      // 1. Subida de imagen al Bucket 'room-images'
      if (images.length > 0) {
        const file = images[0];
        const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('room-images')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }

      // 2. Inserción en la tabla 'listings' con NOMBRES DE COLUMNA EXACTOS
      const { data: newAd, error: insertError } = await supabase
        .from('listings') 
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          district: formData.district,
          room_type: formData.roomType,
          target_public: formData.target, // CORREGIDO: Coincide con tu esquema
          bath_type: formData.bathType,
          guarantee: formData.guarantee,
          services: formData.services,
          images: [imageUrl],             // CORREGIDO: Coincide con tu esquema (como arreglo)
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      if (newAd) {
        addAd(newAd);
        setStep(2);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error de Supabase: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#121212] border border-white/10 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl">
          <div className="w-24 h-24 bg-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-fuchsia-500/30">
            <CheckCircle2 className="text-fuchsia-500" size={48} />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">¡PUBLICADO!</h2>
          <button onClick={() => navigate('/mis-anuncios')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-fuchsia-500 hover:text-white transition-all">Ver mis anuncios</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-xl mx-auto relative">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
        </button>

        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.8] mb-12">NUEVO <span className="text-fuchsia-600">ANUNCIO</span></h1>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div className="space-y-4">
              <input required name="title" value={formData.title} onChange={handleInputChange} placeholder="TÍTULO DEL ANUNCIO" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-fuchsia-500/50 outline-none transition-all" />
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="DESCRIPCIÓN DETALLADA..." className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-fuchsia-500/50 outline-none transition-all resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input required type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="PRECIO MENSUAL S/" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-fuchsia-500/50 outline-none transition-all" />
              <select name="district" value={formData.district} onChange={handleInputChange} className="bg-[#1A1A1A] border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none">
                <option value="Jesús María">Jesús María</option>
                <option value="Lince">Lince</option>
                <option value="Miraflores">Miraflores</option>
                <option value="San Isidro">San Isidro</option>
                <option value="Surco">Surco</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[9px] font-black text-white/20 uppercase mb-2 block tracking-widest">Tipo de Baño</label>
                 <select name="bathType" value={formData.bathType} onChange={handleInputChange} className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[11px] outline-none">
                   <option value="Privado">Privado</option>
                   <option value="Compartido">Compartido</option>
                 </select>
               </div>
               <div>
                 <label className="text-[9px] font-black text-white/20 uppercase mb-2 block tracking-widest">Garantía</label>
                 <select name="guarantee" value={formData.guarantee} onChange={handleInputChange} className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[11px] outline-none">
                   <option value="Sin garantía">Sin garantía</option>
                   <option value="1x1">1x1 (Mes adelanto)</option>
                   <option value="2x1">2x1</option>
                 </select>
               </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-white/20 uppercase mb-4 block tracking-widest">Servicios Incluidos</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'wifi', icon: Wifi, label: 'WIFI' },
                  { id: 'water', icon: Utensils, label: 'LUZ/AGUA' },
                  { id: 'laundry', icon: Wind, label: 'LAVANDERÍA' }
                ].map((service) => (
                  <button key={service.id} type="button" onClick={() => toggleService(service.id)} className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${formData.services.includes(service.id) ? 'bg-fuchsia-600/20 border-fuchsia-500' : 'bg-white/5 border-white/5'}`}>
                    <service.icon size={16} className={formData.services.includes(service.id) ? 'text-fuchsia-500' : 'text-white/20'} />
                    <span className="text-[8px] font-black mt-2">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <div onClick={() => fileInputRef.current?.click()} className="aspect-video border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:border-fuchsia-500/50 transition-all overflow-hidden relative group">
              {previews.length > 0 ? (
                <img src={previews[previews.length - 1]} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <Camera className="text-white/10 group-hover:text-fuchsia-500 transition-colors mb-2" size={32} />
                  <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">Subir Foto Principal</span>
                </>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl text-white transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'PUBLICAR AHORA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};