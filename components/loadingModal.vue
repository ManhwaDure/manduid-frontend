<template>
  <div class="modal" :class="{ 'is-active': active }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p>
          <span class="loading-icon">
            <font-awesome-icon icon="circle-notch" spin />
          </span>
          <br />
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  text-align: center;
}
.loading-icon {
  font-size: 3rem;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '처리중입니다. 잠시만 기다려주세요.',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
