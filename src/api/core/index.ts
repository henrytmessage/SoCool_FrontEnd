import axiosInstance from "../axiosInstance";
import { IBodyAuthOTP, IBodyAuthRegister, IBodyPostLink } from "./interface";

// vi du
export const getApiExample = (messageChat: string) => {
  return axiosInstance.get('/us-states');
}

export const postLink = (body: IBodyPostLink) => {
  return axiosInstance.post('/link', body);
}

export const postAuthOtp = (body: IBodyAuthOTP) => {
  return axiosInstance.post('/auth/otp', body);
}

export const postAuthRegister = (body: IBodyAuthRegister) => {
  return axiosInstance.post('/auth/register', body);
}