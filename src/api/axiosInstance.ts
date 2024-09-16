import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshToken } from './core';

// let currentLanguage = localStorage.getItem('language');
const MAX_RETRY_COUNT = 5;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;  // Optional retry count property
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Replace with your API base URL
  timeout: 20000, // Example timeout configuration
  headers: {
    'Content-Type': 'application/json',
    // 'accept-language': currentLanguage
  },
});

// Function to update axiosInstance headers
// const updateHeaders = () => {
//   const newLanguage = localStorage.getItem('language');
//   if (newLanguage !== currentLanguage) {
//     currentLanguage = newLanguage;
//     axiosInstance.defaults.headers['accept-language'] = newLanguage;
//   }
// };

// Initial call to set headers
// updateHeaders();

// Request interceptor for adding authorization token
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Perform actions before request is sent
    const accessToken = sessionStorage.getItem('access_token');
    const token = accessToken && JSON.parse(accessToken).token;
    if (token) {
      // Ensure config.headers is initialized before assigning Authorization header
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // Handle success responses globally
    return response;
  },
  async (error: AxiosError) => {
    // Handle error responses globally
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status === 401 
      && originalRequest._retryCount 
      && originalRequest._retryCount < MAX_RETRY_COUNT) {
        originalRequest._retryCount += 1;

      // Redirect to login page or handle unauthorized error
      console.log('Unauthorized request');
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }
      try{
        const refreshTk = sessionStorage.getItem('refresh_token');

        const token = refreshTk && JSON.parse(refreshTk).token;

        if (token){
          const response = await refreshToken({
            refresh_token: token
          })

          const accessToken = response.data.access_token
          if (accessToken){
            sessionStorage.setItem('access_token', accessToken)

            if (error?.config) {
              const newHeaders = axios.AxiosHeaders.from({
                ...error.config.headers,
                Authorization: `Bearer ${token}`,
              });
            
              error.config.headers = newHeaders;

              return axiosInstance(error.config)
            }
          }
        }

      }catch(error){
        console.error('Error when refresh token',error)
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Listen to changes in localStorage 'language' key
// setInterval(updateHeaders, 1000); 
// Check every second for changes in 'language'

export default axiosInstance;
