<script setup lang="ts">
import { isNumber } from '@coloration/kit';
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { ClientStatus, IpcType } from '../../types';
import { exportConfigFile, startModule } from './api'

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

  window.ipcRenderer.on(IpcType.IOT_TRANS, (event, data) => {
    console.log('3333', data)
    store.dispatch('', data)
  })
  startModule()
  .then(() => {
    console.log('????!!')
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
