<template>
  <p>
    관리자페이지입니다. 보안을 위해 할 일을 다 하셨다면 반드시 로그아웃을
    해주세요.
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  middleware: 'isAuthenticated',
  layout: 'admin',
})
</script>
