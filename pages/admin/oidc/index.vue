<template>
  <div>
    <h1 class="title">OAuth2 Client 관리</h1>
    <h2 class="subtitle">
      다른 사이트와의 통합 로그인 연동에 이용되는 OAuth2 Client들을 관리합니다.
    </h2>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>client_id</th>
          <th>이름</th>
          <th>동작</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="clients.length === 0">
          <td colspan="3" class="has-text-centered" style="color: gray">
            OAuth2 Client 없음
          </td>
        </tr>
        <tr v-for="client in clients" v-else :key="client.id">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>
            <nuxt-link
              class="button"
              :to="`/admin/oidc/${encodeURIComponent(client.id)}/update`"
              >수정</nuxt-link
            >
            <button
              type="button"
              class="button is-danger"
              @click.prevent="deleteClient(client)"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nuxt-link to="/admin/oidc/create" class="button is-primary"
      >OAuth2 Client 생성</nuxt-link
    >
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  layout: 'admin',
  middleware: hasPermission('oidc.list'),
  data() {
    return {
      clients: [],
    }
  },
  apollo: {
    clients: {
      query: gql`
        query {
          oauth2Clients {
            id
            name
          }
        }
      `,
      update: (data) => data.oauth2Clients,
    },
  },
  methods: {
    async deleteClient(client: { id: string; name: string }) {
      if (
        confirm(`정말로 ${client.name}(${client.id})을(를) 삭제하겠습니까?`)
      ) {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($id: ID!) {
              deleteOAuth2Client(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: client.id,
          },
        })

        await this.$apollo.queries.clients.refetch()
      }
    },
  },
})
</script>
