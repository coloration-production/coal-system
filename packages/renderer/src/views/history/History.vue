<script lang="ts" setup>
import { IPage, ICard, IButton, IBadge, IText, IHangText, IModal } from '@coloration/island'
import { Table, StatusBadge } from '../../components'
import { useToggle } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { getHistory, clearHistory } from '../../api';
import { IotHistoryItemDto } from '../../../../core';

const [confirmVisible, toggleConfirmVisible] = useToggle(false)

onMounted(() => {
  getHistory()
  .then((res: any) => {
    items.value = res.data
  })
})

const columns = [
  { prop: 'date', label: '日期' },
  { prop: 'max', label: '最大值' },
  { prop: 'warningCount', label: '报警次数' },
  { prop: 'clients', label: '报警节点' },
]

const items = ref<IotHistoryItemDto[]>([])


function handleClearHistory () {
  clearHistory()
  .then(() => {
    items.value = []
    toggleConfirmVisible(false)
  })
}

</script>
<template>
<IPage title="历史记录">
  <template #header-rest>
    <div class="flex-1 ml-4">
      <IHangText size="md">History Record</IHangText>
    </div>
  </template>
  <ICard title="近30天报警记录" class="bg-opacity-90">
    <template v-slot:header-rest>
      <div class="flex flex-1 justify-between items-end ml-2">
        <IHangText>History Record</IHangText>
        <IButton color="red" type="primary" @click="(toggleConfirmVisible as any)">清除记录</IButton>
      </div>
    </template>
    <Table 
      :columns="columns"
      :items="items"
    >

      <template #table-col-clients="{ item }">
        <IText size="xs" v-for="cl in item.clients" :key="cl" class="mr-2">
          {{ cl }}
        </IText>
      </template>
    </Table>  
  </ICard>

  <IModal 
    :visible="confirmVisible" 
    title="清除记录" 
    @close="toggleConfirmVisible" 
    @confirm="handleClearHistory" 
    :line-visible="false">
    你确定要清除历史记录吗？清除后记录将无法找回

    <template #footer-cancel-button-name>
        取消
    </template>
    <template #footer-confirm-button-name>
        确定
    </template>
  </IModal>
</IPage>
</template>