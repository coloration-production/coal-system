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

const items = computed(() => [])

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
    
  </ICard>
</IPage>
</template>