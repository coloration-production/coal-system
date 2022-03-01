<script lang="ts" setup>
import { IPage, IBadge } from '@coloration/island'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Table } from '../../components'

const router = useRouter()

const columns = [
  { prop: 'device_no', label: '设备编号' },
  { prop: 'work_address', label: '作业地点' },
  { prop: 'dust_status', label: '当前值' },
  { prop: 'dust_trend', label: '趋势' },
]

const items = Array.from({ length: 48 }).map((_, i) => {
  const value = Math.round(Math.random() * 100) + 50
  return {
    device_no: i + 1,
    work_address: `Left ${101 + i}`,
    dust_value: value,
    dust_status: value < 120 ? 'safe' : value < 140 ? 'warning' : 'danger',
    dust_trend: Array.from({ length: 10 }).map(() => {
      return value + Math.round(Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1)
    }),
  }
})

const statusConf = (status: string) => {
  switch (status) {
    case 'safe':
      return {
        name: '正常',
        color: 'indigo',
      }
    case 'warning':
      return {
        name: '异常',
        color: 'yellow',
      }
    case 'danger':
      return {
        name: '危险',
        color: 'red',
      }
    default:
      return {
        name: '离线',
        color: 'gary',
      }
  }
}

</script>
<template>
<IPage title="节点列表">
  <div class="md:flex">
      <Table
        :columns="columns"
        :items="items.slice(0, items.length / 2)"
        class="md:w-1/2 md:mr-2"
      >
        <template #table-col-dust_status="{ item }">
          <IBadge :color="statusConf(item.dust_status).color">
            {{ statusConf(item.dust_status).name }}: {{ item.dust_value }}
          </IBadge>
        </template>

        <!-- <template #table-col-dust_trend="{ item }">
          <TableLineChart :data="chartConf(item.dust_trend, item.dust_status)" width="100" height="15" />
        </template> -->
      </Table>
      <Table
        :columns="columns"
        :items="items.slice(items.length / 2)"
        class="text-xs md:w-1/2"
      >
        <template #table-col-dust_status="{ item }">
          <IBadge :color="statusConf(item.dust_status).color">
            {{ statusConf(item.dust_status).name }}: {{ item.dust_value }}
          </IBadge>
        </template>

        <!-- <template #table-col-dust_trend="{ item }">
          <TableLineChart :data="chartConf(item.dust_trend, item.dust_status)" width="100" height="15" />
        </template> -->
      </Table>
    </div>
</IPage>
</template>