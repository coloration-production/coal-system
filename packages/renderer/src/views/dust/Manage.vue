<script lang="ts" setup>
import { IPage, ICard, IBadge, IDirectionIcon, IPlusButton } from '@coloration/island'
import { Table, StatusBadge } from '../../components'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { DustNodeDto } from '../../../../types'

const store = useStore()
const router = useRouter()
const selectedItems = ref([])
const descVisibleSigns = ref<boolean[]>([])
const maxValueEditable = ref(false)
const maxValue = ref(150)

function calStatus(s: number) {
  switch (s) {
    case 1: return { name: '正常', color: 'green' }
    case 0: return { name: '离线', color: 'gray' }
  }
}

const items = computed<DustNodeDto[]>(() => [])

watch(items, () => {
  descVisibleSigns.value = items.value.map(() => true)
}, { immediate: true })

const columns = [
  { prop: 'id', label: '节点编号' },
  { prop: 'uri', label: '节点IP' },
  { prop: 'status', label: '节点状态' },
  { prop: 'device_count', label: '节点设备数量' },
  { prop: 'detail', label: '节点详情' },
]



const subColumns = [
  { prop: 'id', label: '设备编号' },
  { prop: 'name', label: '备注' },
  // { prop: 'value', label: '当前值' },
  { prop: 'status', label: '状态' },
  // { prop: 'dust_trend', label: '趋势' },
]
</script>
<template>
<IPage title="设备管理">
  <ICard :title="`全部 控制线路 ${items.length}`">
    <template v-slot:header-rest>
      <IPlusButton type="primary">控制线路</IPlusButton>
    </template>
  </ICard>
</IPage>
</template>