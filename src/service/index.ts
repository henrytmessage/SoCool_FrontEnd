import { getAliasInfos, getApiExample, getConversation, getConversationList, getDetailConversation, getJobDescription, getLink, postAuthOtp, postAuthRegister, postConversation, postConversationCreateSearchPrice, postConversationCreateTitle, postConversationSendMessage, postCreateLink, postLink, postLinkAnswer, postLinkDeactivate, postLinkGenerateAnswerByAi, postLinkGenerateQuestion, postLinkUploadFile, postLogin, postLoginGoogle, postSaveCompanyOrProjectName, postSendEmailRunOnRice } from "../api/core";
import { IBodyAuthOTP, IBodyAuthRegister, IBodyConversation, IBodyConversationList, IBodyCreateLink, IBodyCreateSearchPrice, IBodyCreateTitle, IBodyDetailConversation, IBodyGenerateAnswerByAi, IBodyGenerateQuestion, IBodyGetJob, IBodyLinkAnswer, IBodyPostLink, IBodySendEmailRunOnRice, IBodySendMessage, ICompanyProject, ILogin, ILoginGoogle } from "../api/core/interface";

export const getExample = async (messageChat: string) => {
  try {
    const response = await getApiExample(messageChat)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw the error so that it can be handled by the caller
  }
};


export const postGenerateLink = async (body: IBodyPostLink) => {
  try {
    const response = await postLink(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw the error so that it can be handled by the caller
  }
}

export const postAuthOTP = async (body: IBodyAuthOTP) => {
  try {
    const response = await postAuthOtp(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw the error so that it can be handled by the caller
  }
}

export const postAuthRegisterService = async (body: IBodyAuthRegister) => {
  try {
    const response = await postAuthRegister(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw the error so that it can be handled by the caller
  }
}

export const postConversationService = async (body: IBodyConversation) => {
  try {
    const response = await postConversation(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getConversationService = async (body: IBodyConversation) => {
  try {
    const response = await getConversation(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postSendMessageService = async (body: IBodySendMessage) => {
  try {
    const response = await postConversationSendMessage(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postCreateTitleSample = async (body: IBodyCreateTitle) => {
  try {
    const response = await postConversationCreateTitle(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postCreateSearchPrice = async (body: IBodyCreateSearchPrice) => {
  try {
    const response = await postConversationCreateSearchPrice(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postServiceLinkDeactivate = async (id: string) => {
  try {
    const response = await postLinkDeactivate(id)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postServiceLinkAnswer = async (body: IBodyLinkAnswer) => {
  try {
    const response = await postLinkAnswer(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getLinkDemo = async () => {
  try {
    const response = await getLink()
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getConversationListService = async (body: IBodyConversationList) => {
  try {
    const response = await getConversationList(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postSendEmailRunOnRiceService = async (body: IBodySendEmailRunOnRice) => {
  try {
    const response = await postSendEmailRunOnRice(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getConversationDetailService= async (body: IBodyDetailConversation) => {
  try {
    const response = await getDetailConversation(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postLinkGenerateQuestionService = async (body: IBodyGenerateQuestion) => {
  try {
    const response = await postLinkGenerateQuestion(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postLinkUploadFileService = async (formData: FormData) => {
  try {
    const response = await postLinkUploadFile(formData)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postLinkGenerateAnswerByAiService = async (body: IBodyGenerateAnswerByAi) => {
  try {
    const response = await postLinkGenerateAnswerByAi(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postCreateLinkService = async (body: IBodyCreateLink) => {
  try {
    const response = await postCreateLink(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getJobDescriptionService = async (body: IBodyGetJob) => {
  try {
    const response = await getJobDescription(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postLoginGoogleService = async (body: ILoginGoogle) => {
  try {
    const response = await postLoginGoogle(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postLoginService = async (body: ILogin) => {
  try {
    const response = await postLogin(body)
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const postSaveCompanyOrProjectNameService = async (body: ICompanyProject) => {
  try{
    const response = await postSaveCompanyOrProjectName(body)
    return response?.data
  }catch(error){
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getAliasInfosService = async () => {
  try{
    const response = await getAliasInfos()
    return response?.data
  }catch(error){
    console.error('Error fetching data:', error);
    throw error;
  }
}