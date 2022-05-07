<script lang="ts" setup>
import { IPage, ICard, ITitle, IText, IHangText, IButtonText, IBadge } from '@coloration/island'
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
  <template #header-rest>
    <div class="ml-4 flex-1">
      <IHangText size="md">Insight Overview</IHangText>
    </div>
  </template>
  <div>
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-full">
        <ICard title="设备实时状态" class="bg-opacity-90">
          <template #header-rest>
            <div class="flex-1 ml-2">
              <IHangText>Real time status of equipment</IHangText>
            </div>
          </template>

          <div class="pt-4 pb-6">
            <div v-for="(bus, i) in mod.buses" :key="i">
              <div class="mx-4">
                <IHangText>
                  {{ bus.name }}
                </IHangText>
              </div>
              <div class="grid grid-cols-12 mx-4 border-gary-100">
                <div v-for="cl in bus.clients" class=" lg:col-span-2 md:col-span-3 col-span-4 h-10 border-b border-gary-100 relative">
                  
                  <div 
                    class="absolute left-0 top-0 bottom-0 transition-all" 
                    :class="{ 
                      'bg-gray-300': cl.status === IotTerminalStatus.offline,
                      'bg-indigo-300': cl.status === IotTerminalStatus.normal,
                      'bg-red-300': cl.status === IotTerminalStatus.abnormal,
                    }"
                    :style="{
                      width: (cl.value / mod.warning) * 100 + '%'
                    }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-between px-2">
                    <IText size="xs" class="text-gray-700">
                      {{ cl.name }}
                    </IText>
                    <IText 
                      size="xs" 
                      class="text-gray-700 font-semibold"
                      :class="{ 
                        'text-gray-700': cl.status === IotTerminalStatus.offline,
                        'text-indigo-700': cl.status === IotTerminalStatus.normal,
                        'text-red-700': cl.status === IotTerminalStatus.abnormal,
                      }"
                      >
                      {{ cl.valueString }}
                    </IText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ICard>
      </div>
      <div class="col-span-full xl:col-span-8">
        <ICard title="粉尘"  class="bg-opacity-90">
          <template #header-rest>
            <div class="flex-1 ml-2">
              <IHangText>Dust</IHangText>
            </div>
          </template>
          <div class="flex rounded-sm">
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>最大值{{timeSuffix}}</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">
                    {{ mod.max.toFixed(2) }} 
                    <IBadge color="green">
                      {{ mod.unit }}
                    </IBadge>
                  </div>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="allMaxs" :category="[]" :max="mod.warning * 1.2" class="h-40" />
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="px-5 pt-5">
                <IHangText>平均值{{timeSuffix}}</IHangText>
                <div class="flex items-start">
                  <div class="text-3xl font-bold text-gray-800 mr-2">
                    {{ mod.average.toFixed(2) }} 
                    <IBadge color="green">
                      {{ mod.unit }}
                    </IBadge>
                  </div>
                </div>
              </div>
              <!-- Chart built with Chart.js 3 -->
              <div class="flex-grow pb-8">
                <Chart :value="allAverages" :category="[]"  :max="mod.warning * 1.2"  class="h-40" />
              </div>
            </div>
          </div>
        </ICard>
      </div>
      <div class="col-span-full xl:col-span-4 min-h-92">
        <ICard 
          title="报警记录"
          class="bg-opacity-90"
        >

          <template v-slot:header-rest>
            <div class="flex-1 ml-2 flex justify-between items-center">
              <IHangText>Record</IHangText>
              <IButtonText @click="clearHistory">清除</IButtonText>
            </div>
          </template>
          <Table
             class="h-24 bg-opacity-0"
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
      <!--
      <div class="col-span-6 xl:col-span-6">
        <ICard title="设备信号状态" class="bg-opacity-90">
          <template #header-rest>
            <div class="flex-1 ml-2">
              <IHangText>Client signal status</IHangText>
            </div>
          </template>
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
        <ICard title="通道信号状态"  class="bg-opacity-90">
          <template #header-rest>
            <div class="flex-1 ml-2">
              <IHangText>Bus signal status</IHangText>
            </div>
          </template>
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
      
      -->
      
    </div>
  </div>
</IPage>
</template>