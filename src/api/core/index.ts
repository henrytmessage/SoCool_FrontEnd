import axiosInstance from "../axiosInstance";
import { IBodyPostLink } from "./interface";

// vi du
export const getApiExample = (messageChat: string) => {
  return axiosInstance.get('/us-states');
}

export const postLink = (body: IBodyPostLink) => {
  return axiosInstance.post('/link', body);
}