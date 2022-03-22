<script setup lang="ts">
import { ILayout, IDashboardIcon, IUsergroupIcon, IDotsIcon, IBarChartIcon, IBoardIcon } from '@coloration/island'
import ISidebar from './ISidebar.vue'


const options = [
  { name: '功能', value: [
    { name: '数据概览', value: '/dashboard/insight', icon: IBarChartIcon },
    // { name: '粉尘监控',  icon: IDashboardIcon, value: [
    //   { name: '设备列表', value: '/dashboard/dust-devices', },
    //   { name: '设备管理', value: '/dashboard/dust-manage', },
    // ] },
    { name: '历史记录', value: '/dashboard/history', icon: IBoardIcon }
  ] },
  { name: '系统', value: [
    { name: '账号设置', value: '/dashboard/setting-account', icon: IUsergroupIcon }, 
    { name: '功能设置', value: '/dashboard/setting-feature', icon: IDotsIcon }, 
  ]}
]
</script>

<template>
  <ILayout type="horizontal">
    <ISidebar :options="options" />
    <ILayout>
      <header class="h-16 border-b border-gray-300 flex justify-end items-center">
        <div class="text-gray-600 hover:text-indigo-500 mr-4">
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
        <div class="w-full flex-1 bg-gray-100">
          <router-view></router-view>
        </div>
      </ILayout>
    </ILayout>
  </ILayout>
</template>

<style scoped>
</style>
