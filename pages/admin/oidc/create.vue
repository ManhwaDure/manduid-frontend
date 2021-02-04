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
          <array-input
            id="redirectUris"
            v-model="redirectUris"
            type="textarea"
            required
            class="textarea"
          ></array-input>
        </div>
        <p class="help">개행문자로 구분합니다.</p>
      </div>
      <div class="field">
        <label for="allowedScopes" class="label">허용된 scope들</label>
        <div class="control">
          <array-input
            id="allowedScopes"
            v-model="allowedScopes"
            required
            type="text"
            class="input"
          />
        </div>
        <p class="help">공백 문자로 구분합니다.</p>
      </div>
      <div class="field">
        <label for="postLogoutRedirectUris" class="label"
          >Post logout redirect uris</label
        >
        <div class="control">
          <array-input
            id="postLogoutRedirectUris"
            v-model="postLogoutRedirectUris"
            type="textarea"
            class="textarea"
          />
        </div>
        <p class="help">
          RP-Initated Logout과 관련된 설정입니다. 개행문자로 구분합니다.
        </p>
      </div>
      <div class="field">
        <label for="backchannelLogoutUri" class="label"
          >Backchannel Logout uri</label
        >
        <div class="control">
          <input
            id="backchannelLogoutUri"
            v-model="backchannelLogoutUri"
            placeholder="공란으로 남길 시 Backchannel Logout 미지원 Client로 간주됨"
            type="text"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <label for="defaultAddedScopes" class="label">자동추가 Scope</label>
        <div class="control">
          <array-input
            id="defaultAddedScopes"
            v-model="defaultAddedScopes"
            type="text"
            class="input"
            placeholder="요청하지 않아도 자동으로 추가되는 scope"
          />
        </div>
      </div>
      <div class="field">
        <label for="returnPermissionsAsObject" class="checkbox">
          <input
            id="returnPermissionsAsObject"
            v-model="returnPermissionsAsObject"
            type="checkbox"
          />&nbsp;permissions claim을 배열이 아닌 객체 형태로 반환
        </label>
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
import ArrayInput from '~/components/arrayInput.vue'

export default Vue.extend({
  components: { ArrayInput },
  layout: 'admin',
  middleware: hasPermission('oidc.create'),
  data() {
    return {
      name: '',
      allowedScopes: ['openid'],
      redirectUris: ['http://example.com/callback'],
      postLogoutRedirectUris: [],
      backchannelLogoutUri: '',
      returnPermissionsAsObject: false,
      defaultAddedScopes: [],
    }
  },
  methods: {
    async createClient() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $name: String!
            $redirectUris: [String!]!
            $allowedScopes: [String!]!
            $backchannelLogoutUri: String
            $postLogoutRedirectUris: [String!]!
            $returnPermissionsAsObject: Boolean!
            $defaultAddedScopes: [String!]!
          ) {
            createOAuth2Client(
              name: $name
              redirectUris: $redirectUris
              allowedScopes: $allowedScopes
              postLogoutRedirectUris: $postLogoutRedirectUris
              backchannelLogoutUri: $backchannelLogoutUri
              returnPermissionsAsObject: $returnPermissionsAsObject
              defaultAddedScopes: $defaultAddedScopes
            ) {
              id
            }
          }
        `,
        variables: {
          name: this.name,
          redirectUris: this.redirectUris,
          allowedScopes: this.allowedScopes,
          backchannelLogoutUri:
            this.backchannelLogoutUri.trim().length !== 0
              ? this.backchannelLogoutUri
              : null,
          postLogoutRedirectUris: this.postLogoutRedirectUris,
          returnPermissionsAsObject: this.returnPermissionsAsObject,
          defaultAddedScopes: this.defaultAddedScopes,
        },
      })

      await this.$router.push('/admin/oidc')
    },
  },
})
</script>
