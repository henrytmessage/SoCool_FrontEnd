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
  IBodyGetJob,
  IBodyLinkAnswer,
  IBodyPostLink,
  IBodySendEmailRunOnRice,
  IBodySendMessage,
  ICompanyProject,
  IGetAllUser,
  ILogin,
  ILoginGoogle,
  IRefreshToken,
  IRemoveAlias,
  ISearchUser,
  IUpdateAccountSetting,
  IUpdatePlan,
  IUserStatus,
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

export const getJobDescription = (params: IBodyGetJob) => {
  return axiosInstance.get('/link/get-job-description', { params });
};

export const refreshToken = (body: IRefreshToken) => {
  return axiosInstance.post('/auth/refresh-token', body);
};

export const postLoginGoogle = (body: ILoginGoogle) => {
  return axiosInstance.post('/auth/login-google', body)
}

export const postLogin = (body: ILogin) => {
  return axiosInstance.post('/auth/login', body)
}

export const postSaveCompanyOrProjectName = (body: ICompanyProject) => {
  return axiosInstance.post('/user/save-company-project-name',body)
}

export const getAliasInfos = () =>{
  return axiosInstance.get('/alias/get-all-alias')
}

export const removeAlias = (body: IRemoveAlias) =>{
  return axiosInstance.post('/alias/remove-alias', body)
}

export const getAccountSetting = () =>{
  return axiosInstance.get('/user/get-account-setting')
}

export const postUpdateAccountSetting = (body: IUpdateAccountSetting) =>{
  return axiosInstance.post('/user/update-account-setting', body)
}

export const postLogout = () =>{
  return axiosInstance.post('/auth/logout')
}

export const getCurrentRole = () =>{
  return axiosInstance.post('/role/get-current-role')
}

export const getAllUser = (body: IGetAllUser) =>{
  return axiosInstance.post('/user/get-all-user', body)
}

export const updatePlan = (body: IUpdatePlan) =>{
  return axiosInstance.post('/user/update-package', body)
}

export const findUserByEmail = (body: ISearchUser) =>{
  return axiosInstance.post('/user/find-users-by-email', body)
}

export const deleteUser = () =>{
  return axiosInstance.post('/user/delete-user')
}

export const changeUserStatus = (body:IUserStatus) =>{
  return axiosInstance.post('/user/change-status',body)
}

export const getUserTotal = () =>{
  return axiosInstance.get('/user/count-all-users')
}
