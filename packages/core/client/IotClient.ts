import { IotTerminalStatus } from '../type'
import { IotBus } from '../bus/IotBus'

export class IotClient {
  #value: number = 0
  #bus: IotBus | null = null
  name: string = ''
  uri: string = ''
  interval: number = 2000
  unit: string = ''
  calcRatio: number = 1
  calcOffset: number = 0
  status: IotTerminalStatus = IotTerminalStatus.offine
  cache: number[] = []
  cacheLength: number = 5
  max: number = this.#value
  average: number = this.#value

  constructor (options: any, bus: IotBus) {
    this.name = options.name || this.name
    this.#bus = bus
  }

  get value () {
    return this.#value
  }

  set value (val: number) {
    this.#value = val
    this.cache.push(val)
    if (this.cache.length > this.cacheLength) {
      this.cache.shift()
    }

    this.max = Math.max(...this.cache)
    const total = this.cache.reduce((acc, n) => acc + n, 0)
    this.average = this.#value / total
  }

  mount () {
    this.status = IotTerminalStatus.normal
  }

  unmount () {
    this.status = IotTerminalStatus.offine
  }


  clacValue (val: number) {
    return (val + this.calcOffset) * this.calcRatio
  }

  clacValueString (val?: number) {
    return val ? this.clacValue(val) : this.value + this.unit
  }

  handler (...args: any[]) {
    return Promise.resolve()
  }
}