import { createStore } from 'vuex'

import { UserDto } from "../../../types";

export const store = createStore<{ user?: UserDto }>({
  state () {
    return {
      user: undefined,
      dust: {
        unit: 'mg',
        average: [10, 12, 13, 45, 23],
        max: [6, 12, 33, 45, 23],
      }
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
    }
  }
})