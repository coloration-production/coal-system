<script lang="ts" setup>
import { watch, ref, watchEffect } from 'vue'
import { init } from 'echarts'
const props = defineProps({
  value: {
    type: Array
  },
  category: {
    type: Array
  },
  color: {
    type: Array,
    default: ['#6366f1'],
  },
  areaColor: {
    type: Array,
    default: ['#e0e7ff'],
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
        show: false
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
