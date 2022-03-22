<script lang="ts" setup>
import { IPage, ICard, ITitle, IBadge, IText, IHangText, IButtonText } from '@coloration/island'
import { computed, ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { IotModuleResponseDto, IotTerminalStatus } from '../../../../core'
import { Chart, Table } from '../../components'

const store = useStore()

const allMaxs = computed(() => store.state.dust.maxCache || [])
const allAverages = computed(() => store.state.dust.averageCache || [])

const mod: ComputedRef<IotModuleResponseDto> = computed(() => store.state.dust)
const historyItems = computed(() => store.state.warningHistory)
const timeSuffix = computed(() => `(${mod.value.interval * mod.value.cacheLength / 1000}s)`)

function clearHistory () {
  store.dispatch('update', { warningHistory: [] })
}
</script>
<template>
<IPage title="数据概览">
  <div>
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-full">
        <ICard title="设备实时状态">
          <div class="grid grid-cols-12 m-4 border-gary-100">
            <div v-for="cl in mod.clients" class="xl:col-span-1 md:col-span-3 lg:col-span-2 col-span-4 h-10 border-b border-gary-100 relative">
              
              <div 
                class="absolute left-0 top-0 bottom-0 transition-all" 
                :class="{ 
                  'bg-gray-100': cl.status === IotTerminalStatus.offline,
                  'bg-indigo-100': cl.status === IotTerminalStatus.normal,
                  'bg-red-100': cl.status === IotTerminalStatus.abnormal,
                }"
                :style="{
                  width: (cl.value / mod.warning) * 100 + '%'
                }"
              ></div>
              <div class="absolute inset-0 flex items-center justify-between px-2">
                <IText size="sm" class="text-gray-700">
                  {{ cl.name }}
                </IText>
                <IText size="xs" class="text-gray-700">
                  {{ cl.valueString }}
                </IText>
              </div>
            </div>
          </div>
        </ICard>
      </div>
      <div class="col-span-full xl:col-span-8">
        <ICard title="粉尘">
          <div class="flex bg-white rounded-sm">
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>最大值{{timeSuffix}}</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">{{ mod.max.toFixed(2) }} {{ mod.unit }}</div>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="allMaxs" :category="[]" class="h-40" />
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>平均值{{timeSuffix}}</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">{{ mod.average.toFixed(2) }} {{ mod.unit }}</div>
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
      <div class="col-span-full xl:col-span-4 min-h-92">
        <ICard 
          title="报警记录"
          
        >
          <template v-slot:header-rest>
            <IButtonText @click="clearHistory">清除</IButtonText>
          </template>
          <Table
             class="h-24"
            :columns="[
              { prop: 'date', label: '时间' },
              { prop: 'bus', label: '线路' },
              { prop: 'client', label: '设备' },
            ]"
            :items="historyItems"
          >
            <template #table-col-date="{ item }">
              <IText size="xs">
                {{ item.date }}
              </IText>
            </template>
            <template #table-col-bus="{ item }">
              <IText size="xs">
                {{ item.bus.map((b: any) => b.name).join(',') }}
              </IText>
            </template>
            <template #table-col-client="{ item }">
              <IText size="xs">
                {{ item.client.map((c: any) => `${c.name}(${c.valueString})`).join(',') }}
              </IText>
            </template>
          </Table>
        </ICard>
      </div>
      <div class="col-span-6 xl:col-span-6">
        <ICard title="设备信号状态">
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">在线数量</ITitle>
            <IBadge color="indigo">
              <IText size="lg">
                {{ mod.clientCount.total - mod.clientCount.offline }}/{{ mod.clientCount.total }}
              </IText>
            </IBadge>
          </div>
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">异常值数量</ITitle>
            <IBadge color="red">
              <IText size="lg">
                {{ mod.clientCount.abnormal }}/{{ mod.clientCount.total - mod.clientCount.offline }}
              </IText>
            </IBadge>
          </div>
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">离线数量</ITitle>
            <IBadge color="gray">
              <IText size="lg">
                {{ mod.clientCount.offline }}/{{ mod.clientCount.total }}
              </IText>
            </IBadge>
          </div>
        </ICard>
      </div>
      <div class="col-span-6 xl:col-span-6">
        <ICard title="通道信号状态">
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">在线数量</ITitle>
            <IBadge color="indigo">
              <IText size="lg">
                {{ mod.busCount.total - mod.busCount.offline }}/{{ mod.busCount.total }}
              </IText>
            </IBadge>
          </div>
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">异常值数量</ITitle>
            <IBadge color="red">
              <IText size="lg">
                {{ mod.busCount.abnormal }}/{{ mod.busCount.total - mod.busCount.offline }}
              </IText>
            </IBadge>
          </div>
          <div class="flex justify-between px-5 py-6 items-center">
            <ITitle :level="3">离线数量</ITitle>
            <IBadge color="gray">
              <IText size="lg">
                {{ mod.busCount.offline }}/{{ mod.busCount.total }}
              </IText>
            </IBadge>
          </div>
        </ICard>
      </div>
      
    </div>
  </div>
</IPage>
</template>