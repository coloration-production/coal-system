<script setup lang="ts">
import { ILayout, IDashboardIcon, IUsergroupIcon, IDotsIcon, IBarChartIcon, IBoardIcon } from '@coloration/island'
import ISidebar from './ISidebar.vue'


const options = [
  { name: '功能', value: [
    { name: '数据概览', value: '/dashboard/insight', icon: IBarChartIcon },
    { name: '粉尘监控',  icon: IDashboardIcon, value: [
      { name: '设备列表', value: '/dashboard/dust-devices', },
      { name: '设备管理', value: '/dashboard/dust-manage', },
    ] },
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
      <header>
        header
        <router-link to="/">sign out</router-link>
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
