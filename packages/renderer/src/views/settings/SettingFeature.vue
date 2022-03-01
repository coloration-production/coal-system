D<script lang="ts" setup>
import { IPage, ICard, ITitle, ILayout, IText, IButton, ILine, IFlexRow } from '@coloration/island'
import { onMounted, ref } from 'vue';
import { exportConfigFile, importConfigFile, resetConfigFile } from '../../api'


const configData = ref<any>({})
const editable = ref<boolean>(false)
const codeBox = ref()

onMounted(() => {
  updateConfigDisplay()
})

function updateConfigDisplay () {
  exportConfigFile()
  .then((res: any) => {
    configData.value = res.data
  })
}

function handleSave () {
  if (!codeBox.value) return
  try {
    const config = JSON.parse(codeBox.value.innerText)
    importConfigFile(config)
    .then(() => {
      updateConfigDisplay()
    })
  }
  catch (e) {
    // 配置格式错误
  }
  editable.value = false
}

function handleReset () {
  resetConfigFile()
  .then(() => {
    updateConfigDisplay()
  })
}

</script>
<template>
<IPage title="功能设置">
  <ICard>
    <ILayout class="px-6 py-6">
      <ITitle :level="3" class="mb-2">配置</ITitle>
      <IText size="sm" class="mb-4">查看和配置源文件</IText>

      <div class="border-2 p-2 rounded mb-4" :class="editable ? 'bg-gray-200 border-gray-600' : 'bg-gray-100 border-gray-100'">
<pre :contenteditable="editable" ref="codeBox">
{{ configData }}
</pre>
      </div>

      <IFlexRow horizontal="between">
        <div>
          <IButton v-if="!editable" color="red" @click="handleReset" class="mr-2">重置</IButton>
          <IButton v-if="!editable" @click="handleReset">拷贝</IButton>
        </div>
        <div>
          <IButton v-if="!editable" @click="editable = true" class="ml-2">编辑</IButton>
          <IButton v-if="editable" @click="editable = false">取消</IButton>
          <IButton v-if="editable" type="primary" class="ml-2" @click="handleSave">保存</IButton>
        </div>
      </IFlexRow>
      
    </ILayout>

  </ICard>
</IPage>
</template>