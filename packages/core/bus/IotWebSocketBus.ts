import WebSocket from 'ws'
import { IotBus } from './IotBus'
import { IotClient } from '../client/IotClient'
import { IotTerminalStatus } from '../type'
import { IotModule } from '../IotModule'

export class IotWebSocketBus extends IotBus {
  
  #ws: WebSocket | null = null
  #timer: number = 0
  clients: IotClient[] = []

  constructor (
    options: any, 
    mod: IotModule,
    IotClientConstrutor: typeof IotClient
  ) {
  
    const { clients, ...restOptions } = options
    super(restOptions, mod, IotClientConstrutor)

    if (Array.isArray(options.clients)) {
      this.clients = options.clients.map((clOpt: any) => {
        return new IotClientConstrutor({ ...restOptions, ...clOpt }, this)
      })
    }
  }

  mount (): void {
    if (this.#ws) this.unmount() 
    this.#ws = new WebSocket(`ws://${this.uri}`)
    this.#ws.binaryType = 'arraybuffer'

    this.#ws.on('open', () => {
      console.log('connected:', this.uri)
      this.status = IotTerminalStatus.normal
      this.clients.forEach(cl => {
        cl.mount()
      })
    })

    this.#ws.on('close', () => {
      this.status = IotTerminalStatus.offine
    })

    this.#ws.on('message', (data: ArrayBuffer) => {
      const response = Buffer.from(data)
      Promise.all(this.clients.map((cl) => cl.handler(response)))
      .then(() => {
        // 
      })

    })

    this.#ws.on('error', (err) => {
      console.log('connect failed', err)
    })

  }

  unmount(): void {
    if (this.#ws) {
      this.#ws.close()
      clearInterval(this.#timer)
      this.clients.forEach(cl => cl.unmount())
      this.#ws = null
      this.status = IotTerminalStatus.offine

    }
  }
  send (data: ArrayBuffer): void {
    this.#ws?.send(data)
  }
}
