<template>
  <form action="POST" @submit.prevent="doChangePassword">
    <fade-transition>
      <div v-if="newPasswordsNotEqual" class="notification is-warning">
        새로운 비밀번호가 서로 동일하지 않습니다.
      </div>
      <div v-else-if="passwordChanged" class="notification is-success">
        비밀번호가 변경됐습니다.
      </div>
      <div v-else-if="passwordNotChanged" class="notification is-danger">
        비밀번호 변경에 실패했습니다.
      </div>
    </fade-transition>
    <div class="field">
      <label for="password" class="label">현재 비밀번호</label>
      <div class="control">
        <input
          id="password"
          v-model="oldPassword"
          type="password"
          class="input"
          placeholder="현재 비밀번호"
        />
      </div>
    </div>
    <div class="field">
      <label for="new_password" class="label">새로운 비밀번호</label>
      <div class="control">
        <input
          id="new_password"
          v-model="newPassword"
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
          v-model="newPasswordRetype"
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
        <button class="button" type="submit">변경</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import fadeTransition from '~/components/fadeTransition.vue'

export default Vue.extend({
  components: { fadeTransition },
  middleware: 'isAuthenticated',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordRetype: '',
      newPasswordsNotEqual: false,
      passwordChanged: false,
      passwordNotChanged: false,
    }
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '비밀번호 변경')
  },
  methods: {
    async doChangePassword() {
      this.newPasswordsNotEqual = false
      this.passwordChanged = false
      this.passwordNotChanged = false
      if (this.newPassword !== this.newPasswordRetype) {
        this.newPasswordsNotEqual = true
        return
      }
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($oldPassword: String!, $newPassword: String!) {
            changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
          }
        `,
        variables: {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        },
      })

      if (result.data.changePassword) {
        this.passwordChanged = true
        this.oldPassword = ''
        this.newPassword = ''
        this.newPasswordRetype = ''
      } else {
        this.passwordNotChanged = true
      }
    },
  },
})
</script>
