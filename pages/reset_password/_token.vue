<template>
  <div v-if="success">비밀번호를 변경했습니다!</div>
  <div v-else-if="success === false">
    비밀번호 변경에 실패했습니다. 주소를 잘못 입력하셨나요?
  </div>
  <form v-else @submit.prevent="resetPassword">
    <div class="field">
      <label for="new_password" class="label">새로운 비밀번호</label>
      <div class="control">
        <input
          id="new_password"
          v-model="password"
          type="password"
          class="input"
          minlength="5"
          required
          placeholder="새로운 비밀번호"
        />
      </div>
    </div>
    <div class="field">
      <label for="new_password_retype" class="label"
        >새로운 비밀번호 재입력</label
      >
      <div class="control">
        <input
          id="new_password_retype"
          v-model="passwordRetype"
          type="password"
          class="input"
          minlength="5"
          required
          placeholder="새로운 비밀번호 재입력"
        />
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button" type="submit" :disabled="isSending">변경</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      success: null as null | boolean,
      isSending: false,
      password: '',
      passwordRetype: '',
    }
  },
  computed: {
    error() {
      return false
    },
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '비밀번호 재설정')
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.passwordRetype)
        return alert('비밀번호와 비밀번호 재입력이 일치하지 않습니다.')
      this.isSending = true
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation($token: String!, $password: String!) {
            resetPassword(resetToken: $token, newPassword: $password)
          }
        `,
        variables: {
          token: this.$route.params.token,
          password: this.password,
        },
      })
      this.isSending = false
      this.success = data.data.resetPassword
    },
  },
})
</script>
