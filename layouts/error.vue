<template>
  <div>
    <p v-if="error.statusCode === 404">페이지를 찾을 수 없습니다.</p>
    <p v-else-if="error.message">
      다음과 같은 오류가 발생했습니다 : {{ error.message }}
    </p>
    <p v-else>알 수 없는 오류가 발생했습니다.</p>
    <br />
    <p>
      자세한 사항은 회장단에게 문의해주세요.<br />
      <a href="#" @click.prevent="$router.go(-1)">이전 페이지로 되돌아가기</a
      ><br />
      <a href="#" @click.prevent="reload">새로고침하기</a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['error'],
  layout: 'error-layout',
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '오류')
    this.$store.commit('TOGGLE_ERROR_RIGHT_CARD_LAYOUT', true)
  },
  methods: {
    reload() {
      location.reload()
    },
  },
})
</script>
