<template>
  <form action="POST" @submit.prevent="sendResetMail">
    <fade-transition>
      <div v-if="success === true" class="notification is-success">
        비밀번호 재전송 메일을 전송했습니다.
      </div>
      <div v-else-if="success === false" class="notification is-danger">
        메일 전송에 실패했습니다. 이메일 주소를 잘못 입력하셨나요?
      </div>
    </fade-transition>
    <div class="field">
      <label for="password" class="label">이메일</label>
      <div class="control">
        <input
          id="email"
          v-model="email"
          type="email"
          class="input"
          placeholder="이메일 주소"
          required
        />
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button" type="submit" :disabled="isSending">
          비밀번호 찾기
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import FadeTransition from '~/components/fadeTransition.vue'

export default Vue.extend({
  components: { FadeTransition },
  data() {
    return {
      email: '',
      notifications: [] as any[],
      isSending: false,
    }
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '비밀번호 찾기')
  },
  methods: {
    async sendResetMail() {
      this.isSending = true
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($emailAddress: String!) {
            forgotPassword(emailAddress: $emailAddress)
          }
        `,
        variables: {
          emailAddress: this.email,
        },
      })
      this.isSending = false

      if (result.data?.forgotPassword) {
        this.notifications.push({})
      }
    },
  },
})
</script>
