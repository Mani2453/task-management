import axios from 'axios';



const instance = axios.create({
  // You can add baseURL or interceptors here if needed
});

// Add Authorization header with JWT for all requests if available
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('session');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default instance;
