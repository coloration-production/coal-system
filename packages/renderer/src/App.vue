<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { ClientStatus, IpcType } from '../../types'
import { exportConfigFile, startModule } from './api'
import { ILayout, IModal, ITitle, IText, IBadge } from '@coloration/island'
import { useToggle } from '@vueuse/core'

const store = useStore()
const connectPools: WebSocket[] = []
const [warningVisible, toggleWarningVisible] = useToggle(false)
const warningData = ref<any>({})
function reset () {
  return new Promise((resolve, reject) => {
    connectPools.map(ws => ws.close())
    resolve('')
  })
}

function warn (data: any) {
  warningData.value = data
  toggleWarningVisible(true)
}

function init () {

  window.ipcRenderer.on(IpcType.IOT_TRANS, (event, data) => {
    store.dispatch('update', {
      dust: data
    })
  })

  window.ipcRenderer.on(IpcType.IOT_WARNING, (event, data) => {
    console.log('warning', data)
    // warn(data)
    store.dispatch('updateWarningHistory', data)
  })

  startModule()
}

onMounted(() => {
  reset()
  .then(() => init())
})
</script>

<template>
<ILayout>
  <router-view />
  <IModal 
    title="警告"
    :visible="warningVisible" 
    @close="toggleWarningVisible"
    @confirm="toggleWarningVisible">
    <div class="mb-2">
      <ITitle :level="3" class="mb-2">
        报警时间
      </ITitle>
      <IText>
        {{ warningData.date }}
      </IText>
    </div>
    <div class="mb-2">
      <ITitle :level="3" class="mb-2">
        报警通道
      </ITitle>

    <IBadge v-for="(b, i) in warningData.bus || []" :key="i">
      {{ b.name }}
    </IBadge>
    </div>
    <div class="mb-2">
      <ITitle :level="3" class="mb-2">
        报警设备
      </ITitle>

      <IBadge class="mr-2" v-for="(cl, i) in warningData.client || []" :key="i">
        {{ cl.name }} {{ cl.valueString }}
      </IBadge>
    </div>

    <template #footer-cancel-button-name>
        取消
    </template>
    <template #footer-confirm-button-name>
        确定
    </template>
  </IModal>
</ILayout>
</template>

<style>
html, body, #app {
  height: 100%;
}
</style>
