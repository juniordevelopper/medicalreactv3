import axios from 'axios';

// 1. Dinamik IP aniqlash (Local tarmoq uchun)
const currentIP = window.location.hostname;
const PORT = '8000';
const BASE_URL = `http://${currentIP}:${PORT}/api/v1/`;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Har bir so'rovga Access Tokenni qo'shish
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: 401 xatosi (token muddati tugashi) bo'lganda Refresh qilish
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar xato 401 bo'lsa va bu qayta so'rov bo'lmasa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          throw new Error("Refresh token topilmadi");
        }

        // Refresh token orqali yangi access token olish
        const res = await axios.post(`${BASE_URL}auth/token/refresh/`, {
          refresh: refreshToken,
        });

        if (res.status === 200) {
          const newAccess = res.data.access;
          localStorage.setItem('access', newAccess);
          
          // Asl so'rovni yangi token bilan qayta yuborish
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // Agar refresh token ham o'lik bo'lsa - Logout
        localStorage.clear();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
