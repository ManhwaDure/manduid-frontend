<template>
  <div>
    <h1 class="title">OAuth2 Client 생성</h1>
    <h2 class="subtitle">OAuth2 Client를 생성합니다.</h2>
    <fade-transition>
      <div v-if="success" class="notification is-success">완료했습니다.</div>
    </fade-transition>
    <form @submit.prevent="updateClient">
      <div class="field">
        <label for="name" class="label">Client ID(client_id)</label>
        <div class="control">
          <input
            id="name"
            v-model="client.id"
            type="text"
            class="input disabled"
            readonly
            disabled
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="name" class="label">Client Secret(client_secret)</label>
        <div class="control">
          <input
            id="name"
            v-model="client.secret"
            type="text"
            class="input disabled"
            required
            readonly
            disabled
          />
        </div>
      </div>
      <div class="field">
        <label for="name" class="label">Client 이름</label>
        <div class="control">
          <input
            id="name"
            v-model="client.name"
            type="text"
            class="input"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="redirectUris" class="label">Redirect uri들</label>
        <div class="control">
          <array-input
            id="redirectUris"
            v-model="client.redirectUris"
            type="textarea"
            required
            class="textarea"
          />
        </div>
        <p class="help">개행문자로 구분합니다.</p>
      </div>
      <div class="field">
        <label for="allowedScopes" class="label">허용된 scope들</label>
        <div class="control">
          <array-input
            id="allowedScopes"
            v-model="client.allowedScopes"
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
            v-model="client.postLogoutRedirectUris"
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
            v-model="client.backchannelLogoutUri"
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
            v-model="client.defaultAddedScopes"
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
            v-model="client.returnPermissionsAsObject"
            type="checkbox"
          />&nbsp;permissions claim을 배열이 아닌 객체 형태로 반환
        </label>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" type="submit">수정</button>
          <button class="button is-danger" @click.prevent="renewSecret">
            client_secret 재생성
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import hasPermission from '~/middleware/hasPermission'
import FadeTransition from '~/components/fadeTransition.vue'
import ArrayInput from '~/components/arrayInput.vue'

export default Vue.extend({
  layout: 'admin',
  middleware: hasPermission('oidc.update'),
  components: { FadeTransition, ArrayInput },
  data() {
    return {
      client: {
        id: '',
        secret: '',
        name: '',
        allowedScopes: [] as string[],
        redirectUris: [] as string[],
        postLogoutRedirectUris: [] as string[],
        backchannelLogoutUri: '',
        returnPermissionsAsObject: false,
        defaultAddedScopes: [] as string[],
      },
      success: false,
    }
  },
  apollo: {
    client: {
      query: gql`
        query($clientId: ID!) {
          getOAuth2ClientById(id: $clientId) {
            id
            secret
            name
            allowedScopes
            redirectUris
            postLogoutRedirectUris
            backchannelLogoutUri
            returnPermissionsAsObject
            defaultAddedScopes
          }
        }
      `,
      variables(): { clientId: string } {
        const { clientId } = this.$route.params
        return {
          clientId,
        }
      },
      update: (data) => data.getOAuth2ClientById,
    },
  },
  methods: {
    async updateClient() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $id: ID!
            $name: String!
            $redirectUris: [String!]!
            $allowedScopes: [String!]!
            $postLogoutRedirectUris: [String!]
            $backchannelLogoutUri: String
            $returnPermissionsAsObject: Boolean!
            $defaultAddedScopes: [String!]!
          ) {
            updateOAuth2Client(
              id: $id
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
          id: this.client.id,
          name: this.client.name,
          redirectUris: this.client.redirectUris,
          allowedScopes: this.client.allowedScopes,
          postLogoutRedirectUris: this.client.postLogoutRedirectUris,
          backchannelLogoutUri: this.client.backchannelLogoutUri,
          returnPermissionsAsObject: this.client.returnPermissionsAsObject,
          defaultAddedScopes: this.client.defaultAddedScopes,
        },
      })

      await this.$apollo.queries.client.refetch()
      this.success = true
      setTimeout(() => (this.success = false), 3000)
    },
    async renewSecret() {
      if (!confirm('정말로 client_secret을 재생성하시겠습니까?')) return
      await this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            renewOAuth2ClientSecret(id: $id) {
              id
            }
          }
        `,
        variables: {
          id: this.client.id,
        },
      })

      await this.$apollo.queries.client.refetch()
      this.success = true
      setTimeout(() => (this.success = false), 3000)
    },
  },
})
</script>
