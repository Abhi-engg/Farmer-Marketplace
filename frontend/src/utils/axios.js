import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Request interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Refresh CSRF token
      return axios.get('http://localhost:8000/api/csrf/', { withCredentials: true })
        .then((response) => {
          axiosInstance.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
          // Retry the original request
          return axiosInstance(error.config);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 