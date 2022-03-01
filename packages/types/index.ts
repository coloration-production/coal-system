export type SigninPayload = {
  username: string
  password: string
}

export type UserDto = {
  username: string
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