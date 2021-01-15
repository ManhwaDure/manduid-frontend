<template>
  <div>
    <h1 class="title">OAuth2 Client 생성</h1>
    <h2 class="subtitle">OAuth2 Client를 생성합니다.</h2>
    <form @submit.prevent="createClient">
      <div class="field">
        <label for="name" class="label">Client 이름</label>
        <div class="control">
          <input id="name" v-model="name" type="text" class="input" required />
        </div>
      </div>
      <div class="field">
        <label for="redirectUris" class="label">Redirect uri들</label>
        <div class="control">
          <textarea
            id="redirectUris"
            v-model="redirectUrisInput"
            required
            class="textarea"
          ></textarea>
        </div>
        <p class="help">개행문자로 구분합니다.</p>
      </div>
      <div class="field">
        <label for="allowedScopes" class="label">허용된 scope들</label>
        <div class="control">
          <input
            id="allowedScopes"
            v-model="allowedScopesInput"
            required
            type="text"
            class="input"
          />
        </div>
        <p class="help">공백 문자로 구분합니다.</p>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">생성</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  layout: 'admin',
  middleware: hasPermission('oidc.create'),
  data() {
    return {
      name: '',
      allowedScopesInput: 'openid',
      redirectUrisInput: 'http://example.com/callback',
    }
  },
  computed: {
    allowedScopes(): string[] {
      return this.allowedScopesInput.trim().split(' ')
    },
    redirectUris(): string[] {
      return this.redirectUrisInput.trim().split('\n')
    },
  },
  methods: {
    async createClient() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $name: String!
            $redirectUris: [String!]!
            $allowedScopes: [String!]!
          ) {
            createOAuth2Client(
              name: $name
              redirectUris: $redirectUris
              allowedScopes: $allowedScopes
            ) {
              id
            }
          }
        `,
        variables: {
          name: this.name,
          redirectUris: this.redirectUris,
          allowedScopes: this.allowedScopes,
        },
      })

      await this.$router.push('/admin/oidc')
    },
  },
})
</script>
