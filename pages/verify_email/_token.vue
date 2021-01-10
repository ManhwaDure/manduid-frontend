<template>
  <div v-if="success">이메일 인증에 성공했습니다!</div>
  <div v-else>
    <loading-icon text="처리중입니다. 잠시만 기다려주세요." />
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import LoadingIcon from '~/components/loadingIcon.vue'
export default Vue.extend({
  components: {
    LoadingIcon,
  },
  data() {
    return {
      success: false,
    }
  },
  async created() {
    await this.$apollo.mutate({
      mutation: gql`
        mutation($token: String!) {
          signUp_verifyEmail(verificationToken: $token)
        }
      `,
      variables: {
        token: this.$route.params.token,
      },
    })

    this.success = true
  },
})
</script>
