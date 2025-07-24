import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8000`,
  withCredentials: true, // Required for Breeze/Sanctum cookies
  withXSRFToken:true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  // timeout: 100000 // 10 seconds timeout
});

// Add CSRF token interceptor for Breeze
axiosClient.interceptors.request.use(config => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }

  return config;
});

export default axiosClient;