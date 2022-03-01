<script lang="ts" setup>
import { IPage, ICard, ITitle, IBadge, IText, IHangText } from '@coloration/island'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Chart } from '../../components'

const router = useRouter()
const store = useStore()

const allMaxs = computed(() => store.state.dust.max || [])
const allAverages = computed(() => store.state.dust.average || [])

const max = computed(() => {
  return allMaxs.value[allMaxs.value.length - 1] || '--'
})

const average = computed(() => {
  if (allAverages.value.length < 1) return '--'
  return allAverages.value.reduce((curr: number, acc: number) => acc + curr, 0) / allAverages.value.length
})

const maxDataset = computed(() => {
  return {
    category: allMaxs.value.map((_: number, i: number) => i),
    value: allMaxs.value
  }
})

const averageDataset = computed(() => {
  return {
    category: allAverages.value.map((_: number, i: number) => i),
    value: allAverages.value
  }
})

const dataset = ref({
  category: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  value: [150, 230, 224, 218, 135, 147, 260]
})

const chartConfig = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
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
                  <IBadge color="green">+492%</IBadge>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="maxDataset.value" :category="maxDataset.category" />
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>平均值</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">{{ average }} {{ store.state.dust.unit }}</div>
                  <IBadge>+49%</IBadge>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="averageDataset.value" :category="averageDataset.category" />
              </div>
            </div>
          </div>
        </ICard>
      </div>
      <div class="col-span-full xl:col-span-4">
        <ICard title="信号异常状态">
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">在线数量</ITitle>
            <IBadge color="green">
              <IText size="lg">
                48/48
              </IText>
            </IBadge>
          </div>
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">异常值数量</ITitle>
            <IBadge color="red">
              <IText size="lg">
                2/48
              </IText>
            </IBadge>
          </div>
        </ICard>
      </div>
      <div class="col-span-full">
        <ICard title="设备状态">
          <div class="grid grid-cols-12 m-4 border-gary-100">
            <div v-for="n in 48" class="xl:col-span-1 md:col-span-3 lg:col-span-2 col-span-4 h-10 border-b border-gary-100 relative">
              
              <div class="absolute left-0 top-0 bottom-0 bg-red-200" :style="{
                width: Math.random() * 100 + '%'
              }"></div>
              <div class="absolute inset-0 flex items-center justify-between px-2">
                <IText size="sm" class="text-gray-700">
                  设备{{n}}
                </IText>
                <IText size="xs" class="text-gray-700">
                  {{n}}
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