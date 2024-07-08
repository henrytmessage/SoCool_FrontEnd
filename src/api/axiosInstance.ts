import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Replace with your API base URL
  timeout: 10000, // Example timeout configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authorization token
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Perform actions before request is sent
    const accessToken = sessionStorage.getItem('access_token');
    const token = accessToken && JSON.parse(accessToken).token;
    if (token) {
      // Ensure config.headers is initialized before assigning Authorization header
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
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
  (error: AxiosError) => {
    // Handle error responses globally
    if (error.response?.status === 401) {
      // Redirect to login page or handle unauthorized error
      console.log('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
