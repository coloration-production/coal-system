<script lang="ts" setup>
import { IPage, ICard, IButton, IBadge, IText, IHangText, IModal } from '@coloration/island'
import { Table, StatusBadge } from '../../components'
import { useToggle } from '@vueuse/core'
import { ref } from 'vue'

const [confirmVisible, toggleConfirmVisible] = useToggle(false)

const columns = [
  { prop: 'date', label: '日期' },
  { prop: 'valueMax', label: '最大值' },
  { prop: 'valueTimes', label: '报警次数' },
  { prop: 'clients', label: '报警节点' },
]

const items = ref([
  { date: '2022-03-08', valueMax: '12', valueTimes: 0, client: []  },
  { date: '2022-03-07', valueMax: '12', valueTimes: 0, client: []  },
  { date: '2022-03-06', valueMax: '122', valueTimes: 3, client: []  },
  { date: '2022-03-05', valueMax: '12', valueTimes: 0, client: []  },
  { date: '2022-03-04', valueMax: '12', valueTimes: 0, client: []  },
])


function handleClearHistory () {
  items.value = []
  toggleConfirmVisible(false)
}

</script>
<template>
<IPage title="历史记录">
  <ICard title="近30天报警记录">
    <template v-slot:header-rest>
      <IButton color="red" @click="(toggleConfirmVisible as any)">清除记录</IButton>
    </template>
    <Table 
      :columns="columns"
      :items="items">
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