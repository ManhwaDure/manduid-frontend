<template>
  <p>로그아웃중입니다. 잠시만 기다려주세요...</p>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    redirect() {
      return typeof this.$route.query.redirect === 'string'
        ? this.$route.query.redirect
        : '/'
    },
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '로그아웃')
    this.$apolloHelpers.onLogout().then(() => {
      if (/^https?:\/\//.test(this.redirect)) location.assign(this.redirect)
      else this.$router.push(this.redirect)
    })
  },
})
</script>
