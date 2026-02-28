import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../api/axios';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('patient/profile/');
      setPatient(res.data);
    } catch (err) {
      console.error("Profil yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <PatientContext.Provider value={{ patient, setPatient, refreshProfile: fetchProfile, loading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
