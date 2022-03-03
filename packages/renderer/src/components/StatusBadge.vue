<script lang="ts">
import { computed, defineComponent } from 'vue'
import { IBadge } from '@coloration/island'
import { StatusMap, ClientStatus } from '../../../types'
import { isNumber } from '@coloration/kit'
export const StatusColorMap = {
  [ClientStatus.offline]: 'gray',
  [ClientStatus.normal]: 'indigo',
  [ClientStatus.warning]: 'yellow',
  [ClientStatus.danger]: 'red',
}

export default defineComponent({
  components: { IBadge },
  props: {
    status: {
      type: Number,
    },
    value: {
      type: Number,
    
    },
  },
  setup(props) {
    const status = props.status || ClientStatus.offline
    const statusText = computed(() => (StatusMap as any)[status])
    const statusColor = computed(() => (StatusColorMap as any)[status])

    return {
      statusText,
      statusColor,
      isNumber
    }
  },
})
</script>
<template>
<IBadge :color="statusColor">
  {{ statusText }} <span v-if="isNumber(value)">:{{ value }}</span>
</IBadge>
</template>
