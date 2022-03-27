<script setup lang="ts">
import { ILayout, IUsergroupIcon, IDotsIcon, IBarChartIcon, IBoardIcon, ITitle, IText, ISidebar, IModal, IBadge } from '@coloration/island'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted, onUnmounted, ref } from 'vue'
import { useToggle } from '@vueuse/core'
import { IpcType } from '../../../types'
import { mountModule, unmountModule } from '../api'

const router = useRouter()
const route = useRoute()
const options = [
  { name: '功能', value: [
    { name: '数据概览', value: '/dashboard/insight', icon: IBarChartIcon },
    // { name: '粉尘监控',  icon: IBarChartIcon, value: [
    //   { name: '设备列表', value: '/dashboard/dust-devices', },
    //   { name: '设备管理', value: '/dashboard/dust-manage', },
    // ] },
    { name: '历史记录', value: '/dashboard/history', icon: IBoardIcon }
  ] },
  { name: '系统', value: [
    { name: '功能设置', value: '/dashboard/setting-feature', icon: IDotsIcon,  }, 
    { name: '账号设置', value: '/dashboard/setting-account', icon: IUsergroupIcon }, 
  ]}
]

const store = useStore()
const [warningVisible, toggleWarningVisible] = useToggle(false)
const [siderBarShadowVisible, toggleSideBarShadowVisible] = useToggle(false)
const warningData = ref<any>({})
const warningBellDom = ref<HTMLAudioElement | null>(null)


function reset () {
  return unmountModule()
  .then(() => {
    warningBellDom.value?.pause()
    store.dispatch('upgradeDust')
  })
   
}

function playWarningAudio () {
  warningBellDom.value?.play()
}

function handleModalClose () {
  warningBellDom.value?.pause()
  toggleWarningVisible(false)
}

function warn (data: any) {
  warningData.value = data
  playWarningAudio()
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
    warn(data)
    store.dispatch('updateWarningHistory', data)
  })

  mountModule()
}


function handleChange (option: any) {
  router.push(option.value)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  reset()
})
</script>

<template>
  <ILayout type="horizontal">
    <ISidebar :options="options" @change="handleChange" :sidebar-open="siderBarShadowVisible" :active="route.path" @close-sidebar="toggleSideBarShadowVisible"/>
    <ILayout>
      <header class="h-16 border-b border-gray-300 flex justify-between items-center px-4">
        <div>
          <div class="lg:hidden text-gray-400 hover:text-indigo-500 cursor-pointer" @click.stop="(toggleSideBarShadowVisible as any)">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path fill="currentColor" d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"/></svg>
          </div>
        </div>

        <div class="text-gray-400 hover:text-indigo-500">
          <router-link to="/">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true" 
              role="img" 
              width="1.2em" 
              height="1.2em" 
              preserveAspectRatio="xMidYMid meet" 
              viewBox="0 0 1536 1664"><rect x="0" y="0" width="1536" height="1664" fill="none" stroke="none" /><path fill="currentColor" d="M1536 896q0 156-61 298t-164 245t-245 164t-298 61t-298-61t-245-164t-164-245T0 896q0-182 80.5-343T307 283q43-32 95.5-25t83.5 50q32 42 24.5 94.5T461 487q-98 74-151.5 181T256 896q0 104 40.5 198.5T406 1258t163.5 109.5T768 1408t198.5-40.5T1130 1258t109.5-163.5T1280 896q0-121-53.5-228T1075 487q-42-32-49.5-84.5T1050 308q31-43 84-50t95 25q146 109 226.5 270t80.5 343zM896 128v640q0 52-38 90t-90 38t-90-38t-38-90V128q0-52 38-90t90-38t90 38t38 90z"/></svg>
          </router-link>
        </div>
      </header>
      <ILayout>
        <div class="w-full h-full flex-1 bg-gray-100 relative">
          <img class="absolute w-full h-full opacity-50 object-fill z-0 select-none" src="../assets/contain-bg.png" />
          <div class="w-full h-full flex-1 z-10">
            <router-view />
          </div>
          <audio id="warning-bell" loop ref="warningBellDom" src="/warning.mp3" />
          <IModal 
            title="警告"
            :visible="warningVisible" 
            @close="handleModalClose"
            @confirm="handleModalClose">
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
        </div>
      </ILayout>
    </ILayout>
  </ILayout>
</template>

<style scoped>
</style>
