import { IotNodeFactory } from './IotNodeFactory'
import { IotClient } from './client'
import { IotBus } from './bus'
import { FixLengthQueue } from './util'

export class IotModule {

  static #ins: IotModule

  #buses: IotBus[] = []

  max: number = 0
  average: number = 0
  maxCache: FixLengthQueue = new FixLengthQueue(5)
  averageCache: FixLengthQueue = new FixLengthQueue(5)

  cb: Function | undefined
  setMax () {
    this.max = this.#buses.reduce((max: number, n: IotBus) => {
      return n.clients.reduce((m: number, cl: IotClient) => {
        return m > cl.max ? m : cl.max
      }, max)
    }, 0)

    this.maxCache.push(this.max)
  }

  setAverage () {
    let length = 0
    const total = this.#buses.reduce((max: number, n: IotBus) => {
      return n.clients.reduce((m: number, cl: IotClient) => {
        length++
        return m + cl.average || 0
      }, max)
    }, 0)

    this.average = length === 0 ? 0 : total / length
    this.averageCache.push(this.average)
  }

  mount (options: any, cb?: Function) {
    const { nodes, ...restOptions } = options
    const nodeFactory = new IotNodeFactory()
    this.#buses = nodes.map((n: any) => {
      return nodeFactory.create({ ...restOptions, ...n }, this)
    })

    this.#buses.forEach(n => n.mount())
    this.cb = cb
  }

  tick () {
    this.setMax()
    this.setAverage()
    this.notify()
  }

  getJSONData () {

    const clients: any[] = []
    const buses = this.#buses.map(bus => {

      const clientJsons = bus.clients.map(cl => {

        const clJson = {
          name: cl.name,
          value: cl.value,
          cache: cl.cache,
          valueString: cl.clacValueString(),
        }

        clients.push(clJson)

        return clJson
      })

      

      return {
        name: bus.name,
        uri: bus.uri,
        status: bus.status,
        clients: clientJsons
      }
    })


    return {
      max: this.max,
      average: this.average,
      maxCache: this.maxCache.getList(),
      averageCache: this.averageCache.getList(),
      buses,
      clients
    }
  }


  notify () {
    this.cb?.(this.getJSONData())
  }

  unmount () {
    this.#buses.forEach(n => n.unmount())
  }

  static get instance () {
    if (!IotModule.#ins) {
      IotModule.#ins = new IotModule()
    }

    return IotModule.#ins
  }
}