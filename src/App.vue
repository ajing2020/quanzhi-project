<template>
  <div class="container">
    <global-header :user="currentUser" />
    <router-view></router-view>
    <global-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter
  },
  setup() {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    return {
      currentUser
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
