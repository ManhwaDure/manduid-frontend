<template>
  <form action="POST" @submit.prevent="doChangePassword">
    <notifications :notifications="notifications" />
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
import Notifications from '~/components/notifications.vue'

export default Vue.extend({
  components: { Notifications },
  middleware: 'isAuthenticated',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordRetype: '',
      notifications: [] as any[],
    }
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '비밀번호 변경')
  },
  methods: {
    async doChangePassword() {
      if (this.newPassword !== this.newPasswordRetype) {
        return this.notifications.push({
          type: 'warning',
          message: '새로운 비밀번호가 서로 일치하지 않습니다.',
          until: Date.now() + 3000,
        })
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
        errorPolicy: 'all',
      })

      if (result.data?.changePassword) {
        this.notifications.push({
          type: 'success',
          message: '비밀번호 변경에 성공했습니다.',
          until: Date.now() + 3000,
        })
        this.oldPassword = ''
        this.newPassword = ''
        this.newPasswordRetype = ''
      } else if (result.errors && result.errors.length > 0) {
        this.notifications.push(
          result.errors.map((i) => {
            return {
              type: 'danger',
              message: '오류가 발생했습니다: ' + i.message,
              until: Date.now() + 3000,
            }
          })
        )
      } else {
        this.notifications.push({
          type: 'danger',
          message: '비밀번호 변경에 실패했습니다.',
          until: Date.now() + 3000,
        })
      }
    },
  },
})
</script>
