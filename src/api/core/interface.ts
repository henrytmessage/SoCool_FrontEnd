export interface IBodyPostLink {
  type?: string | undefined
  title?: string
  price?: string
  address?: string
  email?: string
  payment_method?: string
}

export interface IBodyAuthOTP {
  email: string
  type?: string
}

export interface IBodyAuthRegister {
  email: string
  otp: string
}

export interface IBodyConversation {
  url: string
}

export interface IBodySendMessage {
  role?: string
  content?: string
  conversation_id?: number
  parent_id?: string
  type?: string
  price?: string
  phone?: string
  currency?: string
  action?: string
  lang?: string
  content_type?: string
}

export interface IBodyCreateTitle {
  title: string;
  type: string
}

export interface IBodyCreateSearchPrice {
  title: string
}

export interface IBodyLinkAnswer {
  id: string,
  answer: string
}

export interface IBodyConversationList {
  page: number,
  page_size: number
}

export interface IBodySendEmailRunOnRice {
  recipient: string,
  subject: string,
  content: string,
  lastMessageId?: string
}

export interface IBodyDetailConversation {
  id: number
}

export interface IBodyGenerateQuestion {
  background_score: number,
  expectation_score: number,
  value_score: number,
  ability_score: number,
  personality_score: number
}

export interface IBodyGenerateAnswerByAi {
  prompt: string
}

export interface IQuestion {
  alias?: string;
  answer?: string;
}

export interface IBodyCreateLink {
  email?: string,
  company_project_name?: string,
  background_score?: number,
  expectation_score?: number,
  value_score?: number,
  ability_score?: number,
  personality_score?: number,
  custom_alias?: string,
  job_close_date?: string,
  questions: IQuestion[]
}

export interface IBodyGetJob {
  code?: string
}

export interface IRefreshToken {
  refresh_token:string
}

export interface ILoginGoogle {
  access_token: string
}

export interface ILogin {
  email: string,
  otp: string
}

export interface ICompanyProject{
  company_or_project_name: string
}

export interface IAliasInfo{
  alias_id:number,
  alias: string,
  job_title:string,
  landing_page:string,
  published_date:string,
  end_date:string,
  no_summitted_cv:string,
  no_not_decide_cv:string,
  no_accepted_cv:string,
  no_rejected_cv:string
}

export interface IRemoveAlias{
  alias_id: number
}

export interface IUpdateAccountSetting {
  project_or_company_name: string,
  received_email: string,
  registered_email: string,
  otp: string
}

export interface IGetAllUser{
  page: number,
  page_size: number
}

export interface IUserInfo{
  id:number,
  email:string,
  created_date:string,
  status:string,
  project_or_company_name:string,
  package:string,
  expiration_date:string
  link_created:number,
  received_cv:number
}

export interface IUpdatePlan{
  newPackage: string,
  user_id:number
}

export interface ISearchUser{
  search: string,
  page: number,
  page_size: number
}

export interface IUserStatus{
  user_status: string,
  user_id: number
}