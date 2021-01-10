<template>
  <div>
    <h1 class="title">입부원서 목록</h1>
    <h2 class="subtitle">온라인으로 접수된 입부원서 목록입니다.</h2>
    <div class="table-container">
      <table class="table is-hoverable is-striped is-fullwidth">
        <thead>
          <tr>
            <th>유형</th>
            <th>성명</th>
            <th>학번</th>
            <th>학과</th>
            <th>생일</th>
            <th>전화번호</th>
            <th>상태</th>
            <th>자세히</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="application in applications"
            :key="application.applicationId"
          >
            <td>{{ application.reApplication ? '재입부' : '입부' }}</td>
            <td>{{ application.name }}</td>
            <td>{{ application.studentId }}</td>
            <td>{{ application.department }}</td>
            <td>{{ application.birthday }}</td>
            <td>{{ application.phoneNumber }}</td>
            <td v-if="application.acceptance === null">접수</td>
            <td v-else-if="application.acceptance.accepted">
              <span style="color: green">승인됨</span>
            </td>
            <td v-else>
              <span style="color: red">불허됨</span>
            </td>
            <td>
              <nuxt-link
                :to="`/admin/applications/${encodeURIComponent(
                  application.applicationId
                )}`"
                >자세히</nuxt-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
export default Vue.extend({
  layout: 'admin',
  data() {
    return {
      applications: [],
    }
  },
  apollo: {
    applications: {
      query: gql`
        query {
          applications {
            applicationId
            reApplication
            name
            studentId
            department
            birthday
            phoneNumber
            acceptance {
              accepted
              acceptedAt
              accepterId
              accepterName
              reason
            }
          }
        }
      `,
      update: (result) => result.applications,
    },
  },
})
</script>
