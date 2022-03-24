<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">欢迎登陆</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入电子邮箱"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label for="form-label">密码</label>
        <validate-input
          :rules="pwdRules"
          v-model="pwdVal"
          placeholder="请输入密码"
          type="password"
          ref="inputRef"
        />
      </div>
      <template #submit>
        <button
          type="submit"
          class="btn btn-primary btn-block btn-large"
        >登陆</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const emailVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const pwdVal = ref('')
    const pwdRules: RulesProp = [{ type: 'required', message: '密码不能为空' }]

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: pwdVal.value
        }
        store
          .dispatch('loginAndFetch', payload)
          .then(() => {
            createMessage('登陆成功 2秒后跳转首页', 'success')
            setTimeout(() => {
              router.push('/')
            }, 2000)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }

    return {
      emailVal,
      emailRules,
      pwdVal,
      pwdRules,
      onFormSubmit
    }
  }
})
</script>

<style>
</style>
