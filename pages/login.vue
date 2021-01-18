<template>
  <div>
    <fade-transition>
      <div v-if="error" class="notification is-danger">{{ error }}</div>
    </fade-transition>
    <form @submit.prevent="doLogin">
      <div class="field">
        <label for="id" class="label">아이디</label>
        <div class="control">
          <input
            id="id"
            v-model="id"
            class="input"
            type="text"
            placeholder="아이디"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="password" class="label">비밀번호</label>
        <div class="control">
          <input
            id="password"
            v-model="password"
            class="input"
            type="password"
            placeholder="아이디"
            required
          />
        </div>
      </div>
      <input type="submit" hidden />
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <nuxt-link to="/forgot_password">비밀번호를 잊으셨나요?</nuxt-link>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field">
              <div class="control">
                <button
                  v-if="loggingIn"
                  class="button is-primary"
                  type="submit"
                  disabled
                >
                  <font-awesome-icon icon="circle-notch" spin />로그인중
                </button>
                <button v-else class="button is-primary" type="submit">
                  로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <hr />
    <h2 class="subtitle">만화두레에 처음이신가요?</h2>
    <p>
      만화두레에 처음이시라면
      <nuxt-link to="/apply">여기</nuxt-link>서 입부해주세요!
    </p>
    <hr />
    <h2 class="subtitle">회원이지만 아이디가 없으신가요?</h2>
    <p><nuxt-link to="/register">여기</nuxt-link>서 아이디를 만들어주세요!</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import fadeTransition from '~/components/fadeTransition.vue'

export default Vue.extend({
  components: { fadeTransition },
  data() {
    return {
      id: '',
      password: '',
      error: null,
      loggingIn: false,
    } as {
      id: string
      password: string
      error: string | null
      loggingIn: boolean
    }
  },
  computed: {
    redirect(): string {
      return typeof this.$route.query.redirect === 'string'
        ? this.$route.query.redirect
        : '/'
    },
  },
  created() {
    if (this.$apolloHelpers.getToken()) {
      this.$router.push(this.redirect)
    }
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '로그인')
  },
  methods: {
    async doLogin(): Promise<void> {
      this.loggingIn = true

      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: String!, $password: String!) {
            login(id: $id, password: $password) {
              success
              token
              errorMessage
            }
          }
        `,
        variables: {
          id: this.id,
          password: this.password,
        },
      })

      this.loggingIn = false
      if (result.errors) {
        this.error =
          '내부 오류가 발생했습니다: ' +
          result.errors.map((i) => i.message).join('\n')
        this.id = ''
        this.password = ''
      } else if (!result.data.login.success) {
        this.error =
          '로그인 오류가 발생했습니다: ' + result.data.login.errorMessage
      } else {
        // 성공
        await this.$apolloHelpers.onLogin(result.data.login.token)
        this.$router.push(this.redirect)
      }
    },
  },
})
</script>
