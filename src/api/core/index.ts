import axiosInstance from '../axiosInstance'
import {
  IBodyAuthOTP,
  IBodyAuthRegister,
  IBodyConversation,
  IBodyConversationList,
  IBodyCreateLink,
  IBodyCreateSearchPrice,
  IBodyCreateTitle,
  IBodyDetailConversation,
  IBodyGenerateAnswerByAi,
  IBodyGenerateQuestion,
  IBodyLinkAnswer,
  IBodyPostLink,
  IBodySendEmailRunOnRice,
  IBodySendMessage,
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

export const getConversationList = (params: IBodyConversationList) => {
  return axiosInstance.get('/conversation/list', { params });
};

export const postSendEmailRunOnRice = (body: IBodySendEmailRunOnRice) => {
  return axiosInstance.post('/email/send-email-on-rice', body)
}

export const getDetailConversation = (params: IBodyDetailConversation) => {
  return axiosInstance.get('/embedding/search-email-by-conversation-id', { params });
}

export const postLinkGenerateQuestion = (body: IBodyGenerateQuestion) => {
  return axiosInstance.post('/link/generate-question', body)
}

export const postLinkUploadFile = (body: FormData) => {
  return axiosInstance.post('/link/upload-file', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const postLinkGenerateAnswerByAi = (body: IBodyGenerateAnswerByAi) => {
  return axiosInstance.post('/link/generate-answer-by-AI', body)
}

export const postCreateLink = (body: IBodyCreateLink) => {
  return axiosInstance.post('/link/create-link', body)
}