import { IotTerminalStatus } from '../type'
import { IotClient } from '../client'
import { IotModule } from '../IotModule'

export class IotBus {
  uri: string = ''
  name: string = ''
  interval: number = 2000
  unit: string = ''
  calcRatio: number = 1
  calcOffset: number = 0
  status: IotTerminalStatus = IotTerminalStatus.offine
  clients: IotClient[] = []
  mod: IotModule | null = null


  constructor (options: any, mod: IotModule, _: typeof IotClient) {
    this.uri = options.uri || this.uri
    this.name = options.name || this.name
    this.interval = options.interval || this.interval
    this.unit = options.unit || this.unit
    this.calcRatio = options.calcRatio || this.calcRatio
    this.calcOffset = options.calcOffset || this.calcOffset

    this.mod = mod
  }

  mount () {
    this.status = IotTerminalStatus.normal
  }


  unmount () {
    this.status = IotTerminalStatus.offine
  }

  send (data: any) {

  }
}

