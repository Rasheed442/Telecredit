import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
