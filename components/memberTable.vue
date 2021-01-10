<template>
  <div>
    <div class="table-container">
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>명부</th>
            <th>성명</th>
            <th>학적</th>
            <th>학과</th>
            <th>학번</th>
            <th>전화번호</th>
            <th>계정 ID</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in membersToDisplay" :key="member.id">
            <td>{{ MemberTypeDescription[member.memberType] }}</td>
            <td>{{ member.name }}</td>
            <td>
              {{
                SchoolRegisterationStatusDescription[
                  member.schoolRegisterationStatus
                ]
              }}
            </td>
            <td>{{ member.department }}</td>
            <td>{{ member.studentId }}</td>
            <td>{{ member.phoneNumber }}</td>
            <td>{{ member.ssoUserId || '' }}</td>
            <td>
              <slot :member="member">
                <nuxt-link
                  :to="`/admin/roll/${member.id}`"
                  class="button is-small"
                  >상세조회</nuxt-link
                >
                <nuxt-link
                  :to="`/admin/roll/${member.id}/edit`"
                  class="button is-small"
                  >수정</nuxt-link
                >
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination v-model="page" :minimum="1" :maximum="pageCount" />
  </div>
</template>

<style scoped>
tbody {
  word-break: keep-all;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Pagination from './pagination.vue'

import {
  SchoolRegisterationStatusDescription,
  MemberTypeDescription,
} from '~/components/EnumDescriptions'
export default Vue.extend({
  components: { Pagination },
  props: {
    members: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      SchoolRegisterationStatusDescription,
      MemberTypeDescription,
      page: 1,
    }
  },
  computed: {
    membersToDisplay() {
      const { count, page } = this as { count: number; page: number }
      return this.members.slice(count * (page - 1), count * page)
    },
    pageCount() {
      return Math.ceil(this.members.length / this.count)
    },
  },
})
</script>
