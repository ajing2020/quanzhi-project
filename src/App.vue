<template>
  <div class="container">
    <global-header :user="currentUser" />
    <loader
      v-if="isLoading"
      text="拼命加载中"
    />
    <router-view></router-view>
    <global-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import createMessage from './components/createMessage'
import Loader from './components/Loader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter,
    Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value
        if (status && message) {
          createMessage(message, 'error')
        }
      }
    )
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style >
html,
body,
#app,
.container-fluid {
  min-height: 100vh;
}
</style>
