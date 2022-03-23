<script lang="ts" setup>
import { watch, ref, watchEffect, PropType } from 'vue'
import { init } from 'echarts'
const props = defineProps({
  value: {
    type: Array as PropType<number[]>
  },
  category: {
    type: Array as PropType<string[]>
  },
  color: {
    type: Array,
    default: ['#6366f1'],
  },
  areaColor: {
    type: Array,
    default: ['#e0e7ff'],
  },
  max: {
    type: Number
  }
})

const canvas = ref()
const chart = ref()

watchEffect(() => {
  if (!canvas.value) return
  console.log(canvas.value.parentNode.offsetWidth)
  chart.value = init(canvas.value, {
    width: canvas.value.parentNode.offsetWidth
  })
})

watch([
  () => props.value,
  () => props.category,
  chart
  ], () => {

  if (!chart.value || !props.value || !props.category) return

  const max = props.max || Math.max(...props.value) * 1.2
  setTimeout(() => {
    chart.value.setOption(Object.assign({
      grid: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        containLabel: false,
        show: false,
      },
      xAxis: {
        type: 'category',
        data: props.category,
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        max: max
      },
    
      series: [
        {
          data: props.value,
          symbol: 'none',
          type: 'line',
          areaStyle: {
            color: props.areaColor[0]
          },
          lineStyle: {
            color: props.color[0]
          }
        }
      ]
    }))

    chart.value.resize()
  }, 100)
}, { immediate: true })

</script>
<template>
  <div ref="canvas" v-bind="$attrs"></div>
</template>
