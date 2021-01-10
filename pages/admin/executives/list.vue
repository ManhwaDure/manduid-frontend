<template>
  <div>
    <h1 class="title">집행부원 목록</h1>
    <h2 class="subtitle">집행부원 명단을 확인할 수 있습니다</h2>
    <member-table :members="members">
      <template v-slot:default="slotProps">
        현재 직책 : {{ slotProps.member.executiveTypeName }}
        <nuxt-link
          :to="`/admin/executives/appoint?memberId=${slotProps.member.id}`"
          class="button is-small"
          >직책 변경</nuxt-link
        >
        <nuxt-link
          :to="`/admin/executives/disappoint?memberId=${slotProps.member.id}`"
          class="button is-danger is-small"
          >해임</nuxt-link
        >
      </template>
    </member-table>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import MemberTable from '~/components/memberTable.vue'
export default Vue.extend({
  layout: 'admin',
  components: {
    MemberTable,
  },
  data() {
    return {
      members: [],
    }
  },
  apollo: {
    members: {
      query: gql`
        query {
          executives {
            id
            memberType
            name
            schoolRegisterationStatus
            studentId
            department
            phoneNumber
            ssoUserId
            executiveTypeName
          }
        }
      `,
      update: (data) => data.executives,
    },
  },
})
</script>
