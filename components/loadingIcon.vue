<template>
  <p class="has-text-centered">
    <span class="loading-icon">
      <font-awesome-icon icon="circle-notch" spin />
    </span>
    <br />
    {{ text }}
  </p>
</template>

<style scoped>
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
  },
})
</script>
