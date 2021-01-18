<template>
  <loading-modal active text="잠시만 기다려주세요..." />
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'

export default Vue.extend({
  async created() {
    const { interactionId } = this.$route.params
    const result = await this.$apollo.mutate({
      mutation: gql`
        mutation($interactionId: String!) {
          processOAuth2Authorization(interactionId: $interactionId)
        }
      `,
      variables: {
        interactionId,
      },
    })

    location.assign(result.data.processOAuth2Authorization)
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', 'SSO 로그인')
  },
})
</script>
