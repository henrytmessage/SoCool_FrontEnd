export interface IBodyPostLink {
  type: string | undefined,
  title: string,
  price: string,
  currency: string,
  note: string,
  email: string,
}

export interface IBodyAuthOTP {
  email: string
}

export interface IBodyAuthRegister {
  email: string,
  otp: string,
}

export interface IBodyConversation {
  "url": string
}

export interface IBodySendMessage {
  role?: string,
  content?: string,
  conversation_id?: number,
  parent_id?: string,
  type?: string,
  price?: string,
  currency?: string,
  action?: string,
  lang?: string
}