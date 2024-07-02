export interface IBodyPostLink {
  type: string | undefined,
  title: string,
  price: string,
  currency: string,
  address: string,
  email: string,
  can_ship: boolean,
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
  phone?: string,
  currency?: string,
  action?: string,
  lang?: string,
  content_type?: string
}