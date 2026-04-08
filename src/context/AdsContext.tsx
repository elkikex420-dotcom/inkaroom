import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdsContext = createContext<any>(undefined);

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ads, setAds] = useState<any[]>([]);

  // CARGA INICIAL: Trae los anuncios reales de Supabase al cargar la app
  useEffect(() => {
    const fetchAds = async () => {
      // CORRECCIÓN 1: Cambiado de 'rooms' a 'listings' para coincidir con tu base de datos real
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAds(data);
      }
    };
    fetchAds();
  }, []);

  // CORRECCIÓN 2: Función addAd segura que evita el error "Object is not iterable"
  const addAd = (newAd: any) => {
    setAds((prevAds) => {
      if (!Array.isArray(prevAds)) return [newAd]; // Protección estricta contra errores de iterabilidad
      
      const exists = prevAds.find(ad => ad.id === newAd.id);
      if (exists) return prevAds;
      return [newAd, ...prevAds];
    });
  };

  // CORRECCIÓN 3: Se agregó updateAd porque el archivo EditAd.tsx lo exige y causaría error
  const updateAd = (id: string | number, updatedData: any) => {
    setAds((prevAds) => {
      if (!Array.isArray(prevAds)) return prevAds;
      return prevAds.map(ad => ad.id === Number(id) ? { ...ad, ...updatedData } : ad);
    });
  };

  return (
    <AdsContext.Provider value={{ ads, addAd, updateAd, setAds }}>
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error("useAds must be used within an AdsProvider");
  }
  return context;
};