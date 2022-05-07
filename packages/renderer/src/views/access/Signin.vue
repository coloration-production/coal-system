<script lang="ts" setup>
import { ITitle, ILabel, IInput, IButton, ILine, IButtonText, IText, IFlexRow } from '@coloration/island'
import BussinessAuthContainer from './BussinessAuthContainer.vue'
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signin } from '../../api'
import { useStore } from 'vuex'
import { IpcType } from '../../../../types'

const router = useRouter()
const store = useStore()

const username = ref('admin')
const password = ref('123456')


onMounted(() => {
  
  window.ipcRenderer.on(IpcType.AUTO_LOGIN, () => {
    nextTick(() => {
      handleSignin()
    })
  })
})

function handleSignin () {
  const params = {
    username: username.value,
    password: password.value
  }

  signin(params)
  .then(res => {
    store.dispatch('update', { user: res.data })
    router.replace('/dashboard/insight')
  })
  .catch(e => {
    // 需要换成自定义弹窗，否则输入框无法聚焦
    window.alert(e)
  })

}


// function handleCrash () {
//   while (true){
//     var elem=document.getElementById("test");
//     var img='<img src="test">'
//     var data=elem.innerHTML
//     elem.innerHTML=data + img
//   }
// }

</script>
<template>
<BussinessAuthContainer>
  <ITitle :level="1" class="mb-6">粉尘信号管理系统</ITitle>
  <!-- Form -->
    <div class="space-y-4">
      <div>
        <ILabel for="email">账号</ILabel>
        <IInput id="email" v-model="username" />
      </div>
      <div>
        <ILabel for="password">密码</ILabel>
        <IInput id="password" type="password" autoComplete="on" v-model="password" />
      </div>

      <IButton block type="primary" @click.prevent="handleSignin">登录</IButton>

      <ILine />

      <IFlexRow horizontal="center">
        <IText size="xs" align="center">
          Power by  <IButtonText size="xs">Singa Inc.</IButtonText>
        </IText>
<!--
        <IButton @click="handleCrash">你好</IButton>
        <div id="test"></div>
-->
      </IFlexRow>
    </div>
  <!-- Footer -->
  <div>
  </div>
</BussinessAuthContainer>
</template>