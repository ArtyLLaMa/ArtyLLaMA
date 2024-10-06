import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Adjust the base URL if necessary
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Adjust based on your auth storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
