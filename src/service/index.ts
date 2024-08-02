import { getApiExample, getConversation, getLink, postAuthOtp, postAuthRegister, postConversation, postConversationCreateSearchPrice, postConversationCreateTitle, postConversationSendMessage, postLink, postLinkAnswer, postLinkDeactivate } from "../api/core";
import { IBodyAuthOTP, IBodyAuthRegister, IBodyConversation, IBodyCreateSearchPrice, IBodyCreateTitle, IBodyLinkAnswer, IBodyPostLink, IBodySendMessage } from "../api/core/interface";

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