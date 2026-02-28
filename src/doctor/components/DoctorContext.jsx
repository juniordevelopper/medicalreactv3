import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../api/axios';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get('doctor/profile/');
      setDoctor(res.data);
    } catch (err) {
      console.error("Profil yuklanmadi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getProfile(); }, []);

  // Ma'lumotlarni qayta yuklash funksiyasi (tahrirdan so'ng chaqiriladi)
  const refreshProfile = () => getProfile();

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, refreshProfile, loading }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);
