<template>
  <right-card-layout-component title="오류" error>
    <Nuxt />
  </right-card-layout-component>
</template>

<script lang="ts">
import Vue from 'vue'
import rightCardLayoutComponent from '~/components/rightCardLayoutComponent.vue'

export default Vue.extend({
  components: { rightCardLayoutComponent },
})
</script>
