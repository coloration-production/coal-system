import { PlainObject } from "@coloration/kit"

export type SigninPayload = {
  username: string
  password: string
}

export type UserDto = {
  username: string
}

export type NodeStatus = ClientStatus
export enum ClientStatus {
  offline = 0,
  normal = 10,
  warning = 20,
  danger = 30,
} 

export const StatusMap = {
  [ClientStatus.offline]: '离线',
  [ClientStatus.normal]: '正常',
  [ClientStatus.warning]: '异常',
  [ClientStatus.danger]: '危险',
}

export interface DustNodeDto {
  id: string,
  uri: string
  status: NodeStatus,
  clients: DustClientDto[]
}

export interface DustClientDto {
  id: string,
  status: ClientStatus,
  name: string,
  value: number,
  trend: number[]
}


export type ResetPasswordPayload = SigninPayload & {
  newPassword: string
}


export enum IpcType {
  REQUEST_RENDERER_RECEIVE = 'REQUEST_RENDERER_RECEIVE',
  REQUEST_RENDERER_SEND = 'REQUEST_RENDERER_SEND',
  REQUEST_MAIN_RECEIVE = 'REQUEST_RENDERER_SEND',
  REQUEST_MAIN_SEND = 'REQUEST_RENDERER_RECEIVE',  
}

export enum RequestType {
  SIGNIN,
  RESET_PASSWORD,

  EXPORT_CONFIG_FILE,
  IMPORT_CONFIG_FILE,
  RESET_CONFIG_FILE,
}