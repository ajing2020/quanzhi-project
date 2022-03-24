<template>
  <teleport to="#back">
    <div
      class="d-flex justify-content-center align-items-center h100 loading-container"
      :style="{backgroundColor:background ||''}"
    >
      <div class="loading-content">
        <div
          class="spinner-border text-primary"
          role="status"
        >
          <span class="visually-hidden">{{text || 'Loading'}}</span>
        </div>
        <p
          v-if="text"
          class="small text-primary"
        >{{text}}</p>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'
export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    useDOMCreate('back')
  }
})
</script>

<style scope>
.loading-container {
  background: rgba(255, 255, 255, 0.5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.loading-content {
  text-align: center;
}
</style>
