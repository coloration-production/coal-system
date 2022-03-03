<script lang="ts" setup>
import { IPage, ICard, ITitle, IBadge, IText, IHangText } from '@coloration/island'
import { c } from '@coloration/kit'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ClientStatus, DustClientDto } from '../../../../types'
import { Chart } from '../../components'

const router = useRouter()
const store = useStore()

const allMaxs = computed(() => store.state.dust.max || [])
const allAverages = computed(() => store.state.dust.average || [])

const max = computed(() => {
  return store.getters.dustMax
})

const average = computed(() => {
  return store.getters.dustAverage
})

const clients = computed(() => store.getters.dustClients)
const onLineClientCount = computed(() => clients.value.filter((cl: DustClientDto) => cl.status !== ClientStatus.offline).length)
const abnormalClientCount = computed(() => clients.value.filter((cl: DustClientDto) => cl.status === ClientStatus.warning || cl.status === ClientStatus.danger).length)
const maxDataset = computed(() => {
  return {
    category: [],
    value: allMaxs.value
  }
})

const averageDataset = computed(() => {
  return {
    category: [],
    value: allAverages.value
  }
})

</script>
<template>
<IPage title="数据概览">
  <div>
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-full xl:col-span-8">
        <ICard title="粉尘">
          <div class="flex col-span-full xl:col-span-8 bg-white rounded-sm">
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>最大值</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">{{ max }} {{ store.state.dust.unit }}</div>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="allMaxs" :category="[]" class="h-40" />
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>平均值</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">{{ average }} {{ store.state.dust.unit }}</div>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="allAverages" :category="[]"  class="h-40" />
              </div>
            </div>
          </div>
        </ICard>
      </div>
      <div class="col-span-full xl:col-span-4">
        <ICard title="信号异常状态">
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">在线数量</ITitle>
            <IBadge color="indigo">
              <IText size="lg">
                {{ onLineClientCount }}/{{ clients.length }}
              </IText>
            </IBadge>
          </div>
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">异常值数量</ITitle>
            <IBadge color="red">
              <IText size="lg">
                {{ abnormalClientCount }}/{{ clients.length }}
              </IText>
            </IBadge>
          </div>
        </ICard>
      </div>
      <div class="col-span-full">
        <ICard title="设备状态">
          <div class="grid grid-cols-12 m-4 border-gary-100">
            <div v-for="cl in clients" class="xl:col-span-1 md:col-span-3 lg:col-span-2 col-span-4 h-10 border-b border-gary-100 relative">
              
              <div 
                class="absolute left-0 top-0 bottom-0" 
                :class="{ 
                  'bg-gray-100': cl.status === 0,
                  'bg-indigo-100': cl.status === 10,
                  'bg-yellow-100': cl.status === 20,
                  'bg-red-100': cl.status === 30,
                }"
                :style="{
                  width: Math.random() * 100 + '%'
                }"
              ></div>
              <div class="absolute inset-0 flex items-center justify-between px-2">
                <IText size="sm" class="text-gray-700">
                  {{ cl.name }}
                </IText>
                <IText size="xs" class="text-gray-700">
                  {{ cl.value }}
                </IText>
              </div>
            </div>
          </div>
        </ICard>
      </div>
    </div>
  </div>
</IPage>
</template>