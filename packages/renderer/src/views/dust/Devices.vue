<script lang="ts" setup>
import { IPage, ICard } from '@coloration/island'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Table, StatusBadge, Chart } from '../../components'
import { useStore } from 'vuex'
import { ClientStatus } from '../../../../types'
const router = useRouter()


const columns = [
  { prop: 'id', label: '设备编号' },
  { prop: 'name', label: '备注' },
  { prop: 'status', label: '当前值' },
  { prop: 'trend', label: '趋势' },
]

const store = useStore()

const items = computed(() => store.getters.dustClients)

function calcColor (status: ClientStatus) {
  switch (status) {
    case ClientStatus.offline: return '#71717a'
    case ClientStatus.normal: return '#6366f1'
    case ClientStatus.warning: return '#eab308'
    case ClientStatus.danger: return '#ef4444'
  }
}

function calcAreaColor (status: ClientStatus) {
  switch (status) {
    case ClientStatus.offline: return '#f4f4f5'
    case ClientStatus.normal: return '#e0e7ff'
    case ClientStatus.warning: return '#fef9c3'
    case ClientStatus.danger: return '#fee2e2'
  }
}


</script>
<template>
<IPage title="节点列表">
  <ICard :title="`全部 控制设备 ${items.length}`">
    <div class="md:flex">
      <Table
        :columns="columns"
        :items="items.slice(0, items.length / 2)"
        class="md:w-1/2"
      >
        <template #table-col-status="{ item }">
          <StatusBadge :status="item.status" :value="item.value" />
        </template>

        <template #table-col-trend="{ item }">
          <div class="md:w-40 lg:w-60 xl:w-70">
            <Chart 
              :value="item.trend" 
              :category="[]" 
              class="h-6" 
              :color="[calcColor(item.status)]"
              :areaColor="[calcAreaColor(item.status)]"
            />
          </div>
        </template>
      </Table>
      <Table
        :columns="columns"
        :items="items.slice(items.length / 2)"
        class="text-xs md:w-1/2"
      >
        <template #table-col-status="{ item }">
          <StatusBadge :status="item.status" :value="item.value" />
        </template>

        <template #table-col-trend="{ item }">
          <div class="md:w-40 lg:w-60 xl:w-70">
            <Chart 
              :value="item.trend" 
              :category="[]" 
              class="h-6" 
              :color="[calcColor(item.status)]"
              :areaColor="[calcAreaColor(item.status)]"
            />
          </div>
        </template>
      </Table>
    </div>
  </ICard>
</IPage>
</template>