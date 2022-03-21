export enum IotTerminalStatus {
  offine = 0,
  normal = 10,
  abnormal = 20
}

export enum IotTerminalSignal {
  MOKE = '_',
  websocket = 'ws',
  serial = 'serial',
}

export enum IotTerminalProtocol {
  MOKE = '_',
  rs485 = 'rs485',
}