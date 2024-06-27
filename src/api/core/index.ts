import axiosInstance from "../axiosInstance";
import { IBodyAuthOTP, IBodyAuthRegister, IBodyConversation, IBodyPostLink, IBodySendMessage } from "./interface";

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

export const postConversation = (body: IBodyConversation) => {
  return axiosInstance.post('/conversation', body);
}

export const postConversationSendMessage = (body: IBodySendMessage) => {
  return axiosInstance.post('/conversation/send-message', body);
}