<script setup lang="ts">
import { isNumber } from '@coloration/kit';
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { ClientStatus } from '../../types';
import { exportConfigFile } from './api'

const store = useStore()
const connectPools: WebSocket[] = []
let conf: any

function reset () {
  return new Promise((resolve, reject) => {
    connectPools.map(ws => ws.close())
    resolve('')
  })
}

function init () {


  exportConfigFile()
  .then((res: any) => {
    conf = res.data
    console.log(conf, 'xxxx')
    const uris = Object.keys(conf.nodes)
    store.dispatch('update', {
      dust: {
        unit: conf.unit,
        max: [],
        average: [],
        interval: isNumber(Number(conf.interval)) ? Number(conf.interval) : 5,
        nodes: uris.map((uri, i) => {
          return {
            id: `${i + 1}`,
            status: ClientStatus.offline,
            uri: uri,
            clients: Object.keys(conf.nodes[uri]).map((clientPort, j) => {
              return {
                id: `${i + 1}-${clientPort}`,
                name: conf.nodes[uri][clientPort],
                status: ClientStatus.offline,
                value: 0,
                trend: []
              }
            })
          }
        })
      }
    })


    uris.map(uri => {
      const ws = new WebSocket(`ws://${uri}`)
      ws.onopen = () => {
        store.dispatch('nodeStatus', {
          uri,
          status: ClientStatus.normal
        })
      }

      ws.onmessage = () => {

      }

      ws.onclose = () => {
        store.dispatch('nodeStatus', {
          uri,
          status: ClientStatus.offline
        })
      }

      ws.onerror = () => {
        store.dispatch('nodeStatus', {
          uri,
          status: ClientStatus.offline
        })
      }
    })
  })
}

onMounted(() => {
  reset()
  .then(() => init())
})
</script>

<template>
  <router-view />
</template>

<style>
html, body, #app {
  height: 100%;
}
</style>
