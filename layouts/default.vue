<template>
  <right-card-layout-component :title="title">
    <Nuxt />
  </right-card-layout-component>
</template>

<script lang="ts">
import Vue from 'vue'
import rightCardLayoutComponent from '~/components/rightCardLayoutComponent.vue'

export default Vue.extend({
  components: { rightCardLayoutComponent },
  computed: {
    title() {
      return this.$accessor.rightCardLayout.title
    },
  },
})
</script>
