import axiosInstance from '../axiosInstance'
import {
  IBodyAuthOTP,
  IBodyAuthRegister,
  IBodyConversation,
  IBodyCreateSearchPrice,
  IBodyCreateTitle,
  IBodyGenerateNextQuestion,
  IBodyLinkAnswer,
  IBodyPostLink,
  IBodySendMessage
} from './interface'

// vi du
export const getApiExample = (messageChat: string) => {
  return axiosInstance.get('/us-states')
}

export const postLink = (body: IBodyPostLink) => {
  return axiosInstance.post('/link', body)
}

export const getLink = () => {
  return axiosInstance.get('/link')
}

export const postAuthOtp = (body: IBodyAuthOTP) => {
  return axiosInstance.post('/auth/otp', body)
}

export const postAuthRegister = (body: IBodyAuthRegister) => {
  return axiosInstance.post('/auth/register', body)
}

export const postConversation = (body: IBodyConversation) => {
  return axiosInstance.post('/conversation', body)
}

export const getConversation = (params: IBodyConversation) => {
  return axiosInstance.get('/conversation', { params });
};

export const postConversationSendMessage = (body: IBodySendMessage) => {
  return axiosInstance.post('/conversation/send-message', body)
}

export const postConversationCreateTitle = (body: IBodyCreateTitle) => {
  return axiosInstance.post('/conversation/create-title-sample', body)
}

export const postConversationCreateSearchPrice = (body: IBodyCreateSearchPrice) => {
  return axiosInstance.post('/conversation/create-search-price', body)
}

export const postLinkDeactivate = (id: string) => {
  return axiosInstance.post(`/link/deactive-link/${id}`)
}

export const postLinkAnswer = (body: IBodyLinkAnswer) => {
  return axiosInstance.post('/conversation/answer', body)
}

export const postGenerateQuestion = (body: IBodyGenerateNextQuestion) => {
  return axiosInstance.post('/conversation/generate-next-question', body)
}