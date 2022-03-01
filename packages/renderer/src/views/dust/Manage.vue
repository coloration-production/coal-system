<script lang="ts" setup>
import { IPage, ICard, IBadge, IDirectionIcon } from '@coloration/island'
import { Table } from '../../components'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedItems = ref([])
const descVisibleSigns = ref([])
const maxValueEditable = ref(false)
const maxValue = ref(150)

function calStatus(s: number) {
  switch (s) {
    case 1: return { name: '正常', color: 'green' }
    case 0: return { name: '离线', color: 'gray' }
  }
}

const columns = [
  { prop: 'device_no', label: '节点编号' },
  { prop: 'ip', label: '节点IP' },
  { prop: 'status', label: '节点状态' },
  { prop: 'device_count', label: '节点设备数量' },
  { prop: 'detail', label: '节点详情' },
]

const items = [
  { id: 1, device_no: 1, ip: '192.168.0.7', device_count: 4, status: 1 },
  { id: 2, device_no: 2, ip: '192.168.0.8', device_count: 16, status: 1 },
  { id: 3, device_no: 3, ip: '192.168.0.9', device_count: 0, status: 0 },
  { id: 4, device_no: 4, ip: '192.168.0.10', device_count: 0, status: 1 },
]


const subColumns = [
  { prop: 'device_no', label: '设备编号' },
  { prop: 'work_address', label: '作业地点' },
  { prop: 'dust_value', label: '当前值' },
  { prop: 'dust_status', label: '状态' },
  { prop: 'dust_trend', label: '趋势' },
]
</script>
<template>
<IPage title="设备状态">
  <ICard :title="`全部 控制节点 ${items.length}`">
    <Table 
      :columns="columns"
      :items="items">
      
      <template #table-row="{ item, i }">
        <tr>
          <td
            class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          >
            {{ item.device_no }}
          </td>
          <td
            class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          >
            {{ item.ip }}
          </td>
          <td
            class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          >

            <IBadge :color="calStatus(item.status)?.color">
              {{ calStatus(item.status)?.name }}
            </IBadge>
          </td>
          <td
            class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          >
            {{ item.device_count }}
          </td>
          <td
            class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          >
            <div class="flex text-gray-400">
              <IDirectionIcon @click="descVisibleSigns[i] = !descVisibleSigns[i]" />
              
            </div>
          </td>
        </tr>
        <tr :class="descVisibleSigns[i] ? '' : 'hidden' ">
          <td colspan="1000" class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap bg-gray-100">
            <Table
              :columns="subColumns"
              :items="items"
            >
            </Table>
          </td>
        </tr>
      </template>
    </Table>  
  </ICard>
</IPage>
</template>