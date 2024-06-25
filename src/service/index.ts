import { getApiExample, postAuthOtp, postAuthRegister, postLink } from "../api/core";
import { IBodyAuthOTP, IBodyAuthRegister, IBodyPostLink } from "../api/core/interface";

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