  import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../api/axios';

const ReceptionContext = createContext();

export const ReceptionProvider = ({ children }) => {
  const [reception, setReception] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('reception/profile/'); // Backendda bu endpointni ochish kerak
      setReception(res.data);
    } catch (err) {
      console.error("Reception profili yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <ReceptionContext.Provider value={{ reception, setReception, refreshProfile: fetchProfile, loading }}>
      {children}
    </ReceptionContext.Provider>
  );
};

export const useReception = () => useContext(ReceptionContext);
