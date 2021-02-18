<template>
  <div v-if="loggedIn" class="content">
    현재 {{ me.name }}으로 로그인하셨습니다.<br />
    외부고리<br />
    <ul>
      <li><a href="https://wiki.caumd.club">위키</a></li>
      <li v-if="me.isExecutive || me.isPresident">
        <a href="https://caumd.club/edit">동아리 소개 웹사이트 관리</a>
      </li>
    </ul>
    관리<br />
    <ul>
      <li>
        <nuxt-link to="/logout">로그아웃</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/profile">프로필 수정</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/change_password">비밀번호 변경</nuxt-link>
      </li>
      <li v-if="me.isExecutive || me.isPresident">
        <nuxt-link to="/admin">관리</nuxt-link>
      </li>
    </ul>
  </div>
  <div v-else>
    로그인이 되어 있지 않습니다. <nuxt-link to="/login">여기</nuxt-link>서
    로그인해주세요.
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      me: {},
    } as {
      me:
        | {}
        | {
            me: { name: string; isExecutive: boolean; isPresident: boolean }
          }
    }
  },
  computed: {
    loggedIn() {
      return this.$apolloHelpers.getToken() !== undefined
    },
  },
  apollo: {
    me: {
      query: gql`
        query {
          me {
            name
            isExecutive
            isPresident
          }
        }
      `,
      update: (me) => {
        return me.me
      },
    },
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '만화두레')
  },
})
</script>
