<template>
  <p>로그아웃중입니다. 잠시만 기다려주세요...</p>
</template>

<script lang="ts">
import gql from 'graphql-tag'
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
  },
  async mounted() {
    if (this.$apolloHelpers.getToken()) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($token: String!) {
            logout(token: $token)
          }
        `,
        variables: {
          token: this.$apolloHelpers.getToken(),
        },
      })
      this.$apolloHelpers.onLogout().then(() => {
        this.goRedirect()
      })
    } else this.goRedirect()
  },
  methods: {
    goRedirect() {
      if (/^https?:\/\//.test(this.redirect)) location.assign(this.redirect)
      else this.$router.push(this.redirect)
    },
  },
})
</script>
