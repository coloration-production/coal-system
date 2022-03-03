import { createStore } from 'vuex'

import { UserDto, DustNodeDto, DustClientDto, ClientStatus } from "../../../types";


export interface IStore {
  user?: UserDto,
  dust: {
    unit: string,
    average: number[],
    max: number[],
    nodes: DustNodeDto[]
  }
}

export const store = createStore<IStore>({
  state () {
    return {
      user: undefined,
      dust: {
        unit: 'mg',
        historyCount: 5,
        average: [10, 12, 13, 45, 27],
        max: [6, 12, 33, 45, 23],
        nodes: [
          { 
            id: '1',
            uri: '0.0.0.0', 
            status: 0, 
            clients: [
              { id: '1-1', status: ClientStatus.offline, name: '设备1', value: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0 ] },
              { id: '1-2', status: ClientStatus.normal, name: '设备2', value: 12, trend: [10, 11, 12, 13, 11, 10, 9, 12 ] },
              { id: '1-3', status: ClientStatus.normal, name: '设备3', value: 12, trend: [10, 11, 12, 13, 11, 10, 9, 12 ] },
              { id: '1-4', status: ClientStatus.warning, name: '设备4', value: 12, trend: [10, 11, 12, 13, 11, 10, 9, 12 ] },
            ] 
          },
          { 
            id: '2',
            uri: '0.0.0.0', 
            status: 0, 
            clients: [
              { id: '2-1', status: ClientStatus.offline, name: '设备5', value: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0 ] },
              { id: '2-2', status: ClientStatus.normal, name: '设备6', value: 12, trend: [10, 11, 12, 13, 11, 10, 9, 12 ] },
              { id: '2-3', status: ClientStatus.normal, name: '设备7', value: 12, trend: [10, 11, 12, 13, 11, 10, 9, 12 ] },
              { id: '2-4', status: ClientStatus.warning, name: '设备8', value: 12, trend: [10, 11, 12, 13, 11, 10, 9, 12 ] },
            ] 
          }
        ]
      }
    }
  },
  getters: {
    dustMax: (state) => {
      const allMax = state.dust.max
      if (allMax.length === 0) return 0
      return allMax[allMax.length - 1]
    },
    dustAverage: (state) => {
      const allAverage = state.dust.average
      if (allAverage.length === 0) return 0
      return allAverage[allAverage.length - 1]
    },
    dustNodes: (state) => {
      return state.dust.nodes
    },
    dustClients: (state) => {
      return state.dust.nodes.reduce<DustClientDto[]>((clients, n) => {
        return clients.concat(n.clients)
      }, [])
    }
  },
  mutations: {
    update (state, payload) {
      for (let key in payload) {
        if (Reflect.has(state, key)) {
          (state as any)[key] = payload[key]
        }
      }
    }
  },
  actions: {
    update (context, payload) {
      context.commit('update', payload)
    },
    nodeStatus (context, payload) {
      const node = context.state.dust.nodes.find(n => n.uri === payload.uri)
      if (!node) return
      node.status = payload.status

      if (payload.status === ClientStatus.offline) {
        node.clients.forEach((cl) => {
          cl.status = ClientStatus.offline
          cl.value = 0
        })
      }
    }
  }
})