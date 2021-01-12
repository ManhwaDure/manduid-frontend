<template>
  <div>
    <h1 class="title">집행부원 해임</h1>
    <h2 class="subtitle">특정 회원을 집행부원 직책에서 해임합니다.</h2>
    <fade-transition>
      <div v-if="success" class="notification is-success">완료됐습니다.</div>
    </fade-transition>
    <div class="box">
      <form @submit.prevent="disappoint">
        <div class="field">
          <label for="name" class="label">이름</label>
          <div class="control">
            <input id="name" v-model="name" type="text" class="input" />
          </div>
        </div>
        <div class="field">
          <label for="studentId" class="label">학번</label>
          <div class="control">
            <input
              id="studentId"
              v-model.number="studentId"
              type="number"
              class="input"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-danger" type="submit">해임</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import fadeTransition from '~/components/fadeTransition.vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  components: { fadeTransition },
  layout: 'admin',
  middleware: hasPermission('executive.disappoint'),
  data() {
    return {
      studentId: 0,
      name: '',
      success: false,
    }
  },
  async created() {
    if (typeof this.$route.query.memberId === 'string') {
      const memberId = parseInt(this.$route.query.memberId)
      if (isNaN(memberId)) return

      const member = await this.$apollo.query({
        query: gql`
          query($memberId: Int!) {
            getMemberById(memberId: $memberId) {
              name
              studentId
              isExecutive
              executiveTypeName
            }
          }
        `,
        variables: {
          memberId,
        },
      })

      const { name, studentId } = member.data.getMemberById
      this.name = name
      this.studentId = studentId
    }
  },
  methods: {
    async disappoint() {
      const member = await this.$apollo.query({
        query: gql`
          query($studentId: Int!, $name: String!) {
            getMemberByStudentId(studentId: $studentId, name: $name) {
              id
            }
          }
        `,
        variables: {
          studentId: this.studentId,
          name: this.name,
        },
      })

      if (member.data.getMemberByStudentId === null)
        return alert('해당 회원을 찾을 수 없습니다.')

      await this.$apollo.mutate({
        mutation: gql`
          mutation($memberId: Int!) {
            disappointExecutive(memberId: $memberId) {
              id
            }
          }
        `,
        variables: {
          memberId: member.data.getMemberByStudentId.id,
        },
      })

      this.success = true
      setTimeout(() => {
        this.success = false
      }, 5000)
    },
  },
})
</script>
