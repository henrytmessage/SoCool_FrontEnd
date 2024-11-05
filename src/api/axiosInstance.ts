import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshToken } from './core';
const MAX_RETRY_COUNT = 3;

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

// Request interceptor for adding authorization token
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Perform actions before request is sent
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Ensure config.headers is initialized before assigning Authorization header
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
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
  async (response: AxiosResponse<any>) => {
    // Handle success responses globally
    // look like refresh token is incorrect
    if (response?.data?.status_code == 400){
      console.log('refresh token is incorrect');
      const refresh_token = localStorage.get('refresh_token') 
      if(refresh_token){
        window.location.href = '/login';
      }
     
    }
    // Unauthorized request
    else if(response?.data?.status_code == 401){
      console.log('Unauthorized request');
        const originalRequest = response.config as CustomAxiosRequestConfig;
        if(!originalRequest._retryCount){
          originalRequest._retryCount = 1
        }
        if (originalRequest._retryCount 
          && originalRequest._retryCount < MAX_RETRY_COUNT) {
            originalRequest._retryCount += 1;

          // Redirect to login page or handle unauthorized error
          if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
          }
          try{
            const refreshTk = localStorage.getItem('refresh_token');

            const token = refreshTk;

            if (token){
              const response = await refreshToken({
                refresh_token: token
              })

              const accessToken = response.data.data.access_token

              if (accessToken){
                
                localStorage.setItem('access_token', accessToken)
                
                if (response.config) {
                  const newHeaders = axios.AxiosHeaders.from({
                    ...response.config.headers,
                    Authorization: `Bearer ${token}`,
                  });
                
                  response.config.headers = newHeaders;

                  
                  return axiosInstance(response.config)
                }
              }
            }
            else {
              
              window.location.href = '/login';
            }

          }catch(error){
            console.error('Error when refresh token',error)
            return Promise.reject(error);
          }
        }
    }
    return response;
  },
  async (error: AxiosError) => {
    // Handle error responses globally
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
