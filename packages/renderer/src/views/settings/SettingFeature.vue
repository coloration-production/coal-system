D<script lang="ts" setup>
import { IPage, ICard, ITitle, ILayout, IText, IButton, IHangText, IFlexRow, IModal, ILine, ILabel, IInput, ISelect } from '@coloration/island'
import { onMounted, ref } from 'vue'
import { exportConfigFile, importConfigFile, resetConfigFile, sendCommand } from '../../api'
import { useToggle } from '@vueuse/core'
import { IotModuleResponseBusDto, IotModuleResponseClientDto, IotModuleResponseDto } from 'packages/core'
import { suffixCrc, numberPrefix, bufferFromHex } from '../../../../core'
import { PlainObject } from '@coloration/kit'

const configData = ref<IotModuleResponseDto | undefined>()
const editable = ref<boolean>(false)
const codeBox = ref()
const [resetVisible, toggleResetVisible] = useToggle(false)
const [modifyVisible, toggleModifyVisible] = useToggle(false)

const clientOptions = ref<IotModuleResponseClientDto[]>([])
const commandOptions = ref<PlainObject[]>([
  { name: '修改地址', value: '060064' },
])

const currentBus = ref<string>('')
const currentCommand = ref<string>(commandOptions.value[0].value)
const currentClient = ref<number>(-1)
const currentPayload = ref<string>('')


const busOptions = ref<IotModuleResponseBusDto[]>([])


function updateConfigDisplay () {
  exportConfigFile()
  .then((res: any) => {
    configData.value = res.data
    busOptions.value = configData.value?.buses || []
    if (configData.value && configData.value.buses.length > 0) {
      const defaultBus = configData.value.buses[0]
      currentBus.value = defaultBus.uri
      clientOptions.value = defaultBus.clients || []
      if (defaultBus.clients.length > 0) {
        currentClient.value = defaultBus.clients[0].address
      }
      
    }
  })
}

function cancelSave () {
  toggleModifyVisible(false)
  editable.value = false
  updateConfigDisplay()
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
  toggleModifyVisible(false)
}

function handleReset () {
  resetConfigFile()
  .then(() => {
    updateConfigDisplay()
    toggleResetVisible(false)
  })
}

function sendCommandToBus () {
  console.log(
    currentBus.value, 
    currentClient.value,
    currentCommand.value,
    currentPayload.value,
  )

  let value = Number(currentPayload.value).toString(16)
  value = numberPrefix(0, 4, value)
  let hexAddress = currentClient.value.toString(16)
  hexAddress = hexAddress.length === 1 ? '0' + hexAddress : hexAddress
  const str = suffixCrc(`${hexAddress}${currentCommand.value}${value}`)
  
  console.log(str)
  sendCommand(currentBus.value, { key: currentCommand.value, data: bufferFromHex(str) })

}

onMounted(() => {
  updateConfigDisplay()
})



</script> 
<template>
<IPage title="系统设置">
  <template #header-rest>
    <div class="ml-4 flex-1">
      <IHangText size="md">System Setting</IHangText>
    </div>
  </template>
  <ICard>
    <ILayout class="px-6 py-6">
      <div>
        <ITitle :level="3" class="mb-2">命令</ITitle>
        <IFlexRow vertical="start" class="gap-4">
          <ISelect class="w-32" v-model="currentBus">
            <option 
              v-for="bus in busOptions" 
              :value="bus.uri">{{ bus.name }}</option>
          </ISelect>
          <ISelect class="w-32" v-model="currentClient">
            <option
              v-for="client in clientOptions"
              :value="client.address">{{ client.name }}</option>
          </ISelect>
          <ISelect class="w-32" v-model="currentCommand">
            <option 
              v-for="cmd in commandOptions" 
              :value="cmd.value">{{ cmd.name }}</option>
          </ISelect>
          <IInput class="w-40" v-model="currentPayload" />
          <IButton @click="sendCommandToBus" type="primary">发送</IButton>
        </IFlexRow>
      </div>

      <ILine class="mb-10 mt-6" />
      <ITitle :level="3" class="mb-2">配置</ITitle>
      <IText size="sm" class="mb-4">查看和配置源文件</IText>

      <div class="border-2 p-2 rounded mb-4" :class="editable ? 'bg-gray-200 border-gray-600' : 'bg-gray-100 border-gray-100'">
<pre :contenteditable="editable" ref="codeBox">
{{ configData }}
</pre>
      </div>

      <IFlexRow horizontal="between">
        <div>
          <IButton v-if="!editable" color="red" @click="(toggleResetVisible as any)" class="mr-2">重置</IButton>
        </div>
        <div>
          <IButton v-if="!editable" @click="editable = true" class="ml-2">编辑</IButton>
          <IButton v-if="editable" @click="editable = false">取消</IButton>
          <IButton v-if="editable" type="primary" class="ml-2" @click="(toggleModifyVisible as any)">保存</IButton>
        </div>
      </IFlexRow>
      
    </ILayout>

  </ICard>

  <IModal 
    title="重置配置" 
    :visible="resetVisible" 
    @close="toggleResetVisible" 
    @confirm="toggleResetVisible"
    :line-visible="false">
    你确定重置配置吗？重置后无法找回当前配置，建议先拷贝备份。修改配置后需要重启软件才能生效。
    <template #footer-cancel-button-name>
        取消
    </template>
    <template #footer-confirm-button>
      <IButton color="red" size="sm" type="primary" @click="handleReset">重置</IButton>
    </template>
  </IModal>

  <IModal 
    title="保存配置" 
    :visible="modifyVisible" 
    @close="cancelSave" 
    @confirm="cancelSave" 
    :line-visible="false">
    你确定修改配置吗？修改配置后需要重启软件才能生效。
    <template #footer-cancel-button-name>
        取消
    </template>
    <template #footer-confirm-button>
      <IButton size="sm" type="primary" @click="handleSave">修改</IButton>
    </template>
  </IModal>
</IPage>
</template>