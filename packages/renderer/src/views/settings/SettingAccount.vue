<script lang="ts" setup>
import { IPage, ICard, ITitle, IText, ILabel, IInput, IFlexRow, ILine, ILayout, IButton, IHangText } from '@coloration/island'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { resetPassword } from '../../api'

const router = useRouter()
const store = useStore()
const inputOldPassword = ref('')
const newPassword = ref('')
const newConfirmPassword = ref('')


const oldPasswordSuggest = computed(() => !inputOldPassword.value ? '请输入原始密码' : '')
const confirmSuggest = computed(() => {
  return (newPassword.value && newPassword.value !== newConfirmPassword.value)
    ? '两次密码不一致'
    : ''
})

const enabled = computed(() => {
  return inputOldPassword.value !== ''
    && newPassword.value !== ''
    && oldPasswordSuggest.value === ''
    && confirmSuggest.value === ''
})


function handleReset () {
  if (!enabled.value && !store.state.user) return
  console.log(store.state.user)

  resetPassword({
    username: store.state.user?.username!,
    password: inputOldPassword.value,
    newPassword: newPassword.value
  })
  .then(res => {
    console.log('reset password success!')
    store.dispatch('update', { user: undefined })
    router.replace('/')
  })
  .catch(e => {
    window.alert(e)
  })


}

</script>
<template>
<IPage title="账号设置">
  <template #header-rest>
    <div class="ml-4 flex-1">
      <IHangText size="md">Account Setting</IHangText>
    </div>
  </template>

  <ICard>
    <ILayout class="px-6 py-6">
      <ITitle :level="3" class="mb-2">修改密码</ITitle>
      <IText size="sm" class="mb-4">登录当前系统所使用的密码</IText>

      <div class="md:w-1/3 lg:w-1/4 2xl:w-1/5 mb-10">
        <ILabel for="password">原始密码</ILabel>
        <IInput 
          id="password" 
          placeholder="请输入..." 
          v-model="inputOldPassword" 
          type="password" 
          :suggest="oldPasswordSuggest"
          :color="oldPasswordSuggest ? 'red' : undefined"
        />
      </div>
      <ITitle :level="3"  class="mb-2">新密码</ITitle>
      <IText  class="mb-4" size="sm">新密码设置后, 会强制登出系统</IText>

      <IFlexRow class="gap-4">
        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/5">
          <ILabel for="newpassword">新密码</ILabel>
          <IInput 
            id="newpassword" 
            placeholder="请输入..." 
            v-model="newPassword"
            type="password" />
        </div>
        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/5">
          <ILabel for="newconfirmpassword">确认新密码</ILabel>
          <IInput 
            id="newconfirmpassword" 
            placeholder="请输入..." 
            type="password"
            v-model="newConfirmPassword"
            :suggest="confirmSuggest"
            :color="confirmSuggest ? 'red' : undefined" />
        </div>
      </IFlexRow>
    </ILayout>

    <ILine />

    
    <IFlexRow class="px-4 py-2" horizontal="end">
      <IButton type="primary" :disabled="!enabled" @click="handleReset">保存修改</IButton>
    </IFlexRow>
  </ICard>
</IPage>
</template>