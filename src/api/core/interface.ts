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