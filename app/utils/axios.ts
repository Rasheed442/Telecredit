import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || 'https://airtimeloanapi.paykiosk.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
