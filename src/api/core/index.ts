import axiosInstance from "../axiosInstance";

// vi du
export const getApiExample = (messageChat: string) => {
  return axiosInstance.get('/us-states');
}