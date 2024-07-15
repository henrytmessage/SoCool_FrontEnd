import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

let currentLanguage = localStorage.getItem('language');

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Replace with your API base URL
  timeout: 20000, // Example timeout configuration
  headers: {
    'Content-Type': 'application/json',
    'accept-language': currentLanguage
  },
});

// Function to update axiosInstance headers
const updateHeaders = () => {
  const newLanguage = localStorage.getItem('language');
  if (newLanguage !== currentLanguage) {
    currentLanguage = newLanguage;
    axiosInstance.defaults.headers['accept-language'] = newLanguage;
  }
};

// Initial call to set headers
updateHeaders();

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

// Listen to changes in localStorage 'language' key
setInterval(updateHeaders, 1000); // Check every second for changes in 'language'

export default axiosInstance;
