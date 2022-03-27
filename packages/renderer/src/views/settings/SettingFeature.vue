D<script lang="ts" setup>
import { IPage, ICard, ITitle, ILayout, IText, IButton, IHangText, IFlexRow, IModal, ILine, ILabel, IInput, ISelect, IDirectionIcon } from '@coloration/island'
import { nextTick, onMounted, ref, watch } from 'vue'
import { exportConfigFile, importConfigFile, resetConfigFile, sendCommand } from '../../api'
import { useToggle } from '@vueuse/core'
import { IotBusConfigure, IotClientConfigure, IotModuleConfigure } from 'packages/core'
import { suffixCrc, numberPrefix, bufferFromHex } from '../../../../core'
import { PlainObject } from '@coloration/kit'
import ToggleContainer from './ToggleContainer.vue'

const configData = ref<IotModuleConfigure | undefined>()
const editable = ref<boolean>(false)
const codeBox = ref()
const [resetVisible, toggleResetVisible] = useToggle(false)
const [modifyVisible, toggleModifyVisible] = useToggle(false)

const clientOptions = ref<IotClientConfigure[]>([])
const commandOptions = ref<PlainObject[]>([
  // { name: '修改地址', value: '060064', key: 'address', },
  { name: '修改地址', value: '06000C', key: 'address', },
  // { name: '修改名称', value: '', key: 'name', },
  { name: '修改低报', value: '060001', key: 'warning', },
  { name: '修改单位', value: '060017', key: 'unit', },
])

const currentBus = ref<string>('')
const currentCommand = ref<string>(commandOptions.value[0].value)
const currentClient = ref<number>(-1)
const currentPayload = ref<string>('')


const busOptions = ref<IotBusConfigure[]>([])


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
    console.log(config)
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
  if (!currentPayload.value) {
    return
  }

  const cmdOpt = commandOptions.value.find(opt => opt.value === currentCommand.value)
  if (!cmdOpt) return
  if (cmdOpt.value) {
    let value = Number(currentPayload.value).toString(16)
    value = numberPrefix(0, 4, value)
    let hexAddress = currentClient.value.toString(16)
    hexAddress = hexAddress.length === 1 ? '0' + hexAddress : hexAddress
    const str = suffixCrc(`${hexAddress}${currentCommand.value}${value}`)
    
    console.log(str)
    sendCommand(currentBus.value, { key: currentCommand.value, data: bufferFromHex(str) })
  }

  if (cmdOpt.key && configData.value) {
    const currBus = configData.value.buses.find(bus => bus.uri === currentBus.value)
    if (!currBus) return
    const currClient = currBus.clients.find(cl => cl.address === currentClient.value)
    if (!currClient) return
    ;(currClient as any)[cmdOpt.key] = isNaN(Number(currentPayload.value)) ? currentPayload.value : Number(currentPayload.value)
    console.log('????')
    nextTick(() => {
      handleSave()
    })
  }
}

function deleteBus (busIndex: number) {
  if (!configData.value?.buses) return
  configData.value.buses.splice(busIndex, 1)
}

function addBus () {
  if (!configData.value) return
  const busIndex = configData.value.buses.length
  configData.value.buses.push({
    name: '线路' + (busIndex + 1),
    uri: '',
    clients: []
  } as any)
}

function deleteClient (busIndex: number, clientIndex: number) {
  if (!configData.value?.buses) return
  configData.value.buses[busIndex].clients.splice(clientIndex, 1)
}

function addClient (busIndex: number) {
  if (!configData.value) return
  const bus = configData.value.buses[busIndex]
  if (!bus) return
  const clientIndex = bus.clients.length
  bus.clients.push({
    name: '设备' + clientIndex,
    address: clientIndex + 1,
  } as any)
}


onMounted(() => {
  updateConfigDisplay()
})

watch(currentBus, () => {
  const bus = configData.value?.buses.find(bus => bus.uri === currentBus.value)
  if (!bus) return
  clientOptions.value = bus.clients
  currentClient.value = clientOptions.value[0]?.address
})


</script> 
<template>
<IPage title="系统设置">
  <template #header-rest>
    <div class="ml-4 flex-1">
      <IHangText size="md">System Setting</IHangText>
    </div>
  </template>
  <ICard class="bg-opacity-90">
    <ILayout class="px-6 py-6">
      <div v-if="configData">
        <IFlexRow horizontal="between" vertical="start">
          <div>
            <ITitle :level="3" class="mb-2">配置界面</ITitle>
            <IText size="sm" class="mb-4">添加或修改线路和设备的软件配置</IText>
          </div>
          
          <div>
            <IButton class="mr-2" @click="addBus">添加线路</IButton>
          </div>
        </IFlexRow>

        <IFlexRow class="gap-4">
          <div>
            <ILabel for="signal">信号</ILabel>
            <ISelect id="signal" v-model="configData.signal" disabled>
              <option value="ws">WebSocket</option>
            </ISelect>
          </div>
          
          <div>
            <ILabel for="protocol">协议</ILabel>
            <ISelect id="protocol" v-model="configData.protocol" disabled>
              <option value="rs485">RS485</option>
            </ISelect>
          </div>
        </IFlexRow>

        <IFlexRow class="gap-4">
          <div>
            <ILabel for="readCommand">读取命令</ILabel>
            <IInput id="readCommand" v-model="configData.readCommand" disabled />
          </div>
          
          <div>
            <ILabel for="readInterval">读取间隔(秒)</ILabel>
            <IInput id="readInterval" v-model.number="configData.readInterval" />
          </div>
        </IFlexRow>

        <IFlexRow class="gap-4">
          <div>
            <ILabel for="calcRatio">数据缩放</ILabel>
            <IInput id="calcRatio" v-model.number="configData.calcRatio" />
          </div>
          
          <div>
            <ILabel for="calcOffset">数据偏移</ILabel>
            <IInput id="calcOffset" v-model.number="configData.calcOffset" />
          </div>
          <div>
            <ILabel for="unit">数据显示单位</ILabel>
            <IInput id="unit" v-model="configData.unit" />
          </div>
          <div>
            <ILabel for="fixCount">数据保留小数</ILabel>
            <IInput id="fixCount" v-model.number="configData.fixCount" />
          </div>
        </IFlexRow>
        <ILine />
        <div v-for="(bus, busIndex) in configData.buses">
          <ToggleContainer v-slot="{ toggle, value }" :default-value="false">
            <ITitle :level="4" class="my-4">
              <IFlexRow horizontal="between">
                <div>
                  <span class="mr-2">
                    线路{{ busIndex + 1 }}
                  </span>
                  <IHangText>{{ bus.name }}</IHangText>
                </div>
                <IFlexRow>
                  <IButton class="mr-2" v-if="value" @click="addClient(busIndex)">添加设备</IButton>
                  <IButton color="red" class="mr-2" @click="deleteBus(busIndex)">删除</IButton>
                  <IText class="text-gray-500" size="sm" @click="(toggle as any)"><IDirectionIcon :direction="value ? 'up' : 'down'" /></IText>
                </IFlexRow>
              </IFlexRow>
            </ITitle>
            <IFlexRow class="gap-4" v-show="value">
              <div>
                <ILabel :for="'busName' + busIndex">线路名称</ILabel>
                <IInput :id="'busName' + busIndex" v-model="bus.name" />
              </div>
              
              <div>
                <ILabel :for="'busUri' + busIndex">线路地址</ILabel>
                <IInput :id="'busUri' + busIndex" v-model="bus.uri" />
              </div>
            </IFlexRow>

            <div v-show="value">
              <div v-for="(client, clIndex) in bus.clients">
                <IHangText>线路{{ busIndex + 1 }} - 设备{{ clIndex + 1 }}</IHangText>
                <IFlexRow class="gap-4">
                  <div>
                    <ILabel :for="`clientName${busIndex}-${clIndex}`">设备名称</ILabel>
                    <IInput :id="`clientName${busIndex}-${clIndex}`" v-model="client.name" />
                  </div>
                  
                  <div>
                    <ILabel :for="`clientAddress${busIndex}-${clIndex}`">设备地址(1-255)</ILabel>
                    <IInput :id="`clientAddress${busIndex}-${clIndex}`" v-model.number="client.address" />
                  </div>

                  <IButton color="red" @click="deleteClient(busIndex, clIndex)">删除</IButton>
                </IFlexRow>
              </div>

            </div>

            <ILine />
          </ToggleContainer>
          
        </div>
        <IFlexRow horizontal="end" class="my-4">
          <IButton class="mr-2" @click="updateConfigDisplay">恢复修改</IButton>
          <IButton type="primary" @click="(toggleModifyVisible as any)">保存修改</IButton>
        </IFlexRow>
      </div>

      <ILine />
      <div class="mt-6">
        <ITitle :level="3" class="mb-2">设备命令</ITitle>
        <IText size="sm" class="mb-4">发送命令修改远程设备</IText>

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
      <ToggleContainer v-slot="{ toggle, value }">
        <ITitle :level="3" class="mb-2">
          <IFlexRow horizontal="between">
            <span>元数据配置</span>
            <IText class="text-gray-500" size="sm" @click="(toggle as any)"><IDirectionIcon :direction="value ? 'up' : 'down'" /></IText>
          </IFlexRow>
        </ITitle>
        <IText size="sm" class="mb-4">查看和修改源文件</IText>

        <div v-show="value" class="border-2 p-2 rounded mb-4" :class="editable ? 'bg-gray-200 border-gray-600' : 'bg-gray-100 border-gray-100'">
<pre :contenteditable="editable" ref="codeBox">
{{ configData }}
</pre>
        </div>

        <IFlexRow horizontal="between" v-show="value">
          <div>
            <IButton v-if="!editable" color="red" @click="(toggleResetVisible as any)" class="mr-2">重置</IButton>
          </div>
          <div>
            <IButton v-if="!editable" @click="editable = true" class="ml-2">编辑</IButton>
            <IButton v-if="editable" @click="editable = false">取消</IButton>
            <IButton v-if="editable" type="primary" class="ml-2" @click="(toggleModifyVisible as any)">保存</IButton>
          </div>
        </IFlexRow>
      
      </ToggleContainer>
      
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