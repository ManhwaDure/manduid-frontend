<template>
  <div>
    <h1 class="title">회장직 인수인계</h1>
    <h2 class="subtitle">회장직을 인수인계합니다.</h2>
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
            <label for="disappointAll" class="checkbox">
              <input
                id="disappointAll"
                v-model="disappointAllExecutives"
                type="checkbox"
              />
              인수인계와 함께 모든 집행부원 해임
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label for="unsubscribeAll">
              <input
                id="unsubscribeAll"
                v-model="unsubscribeAll"
                type="checkbox"
              />
              모든 구독을 이메일, LINE 등 방법에 상관없이 모두 해제
            </label>
          </div>
        </div>
        <p style="color: red">한 번 하면 되돌릴 수 없습니다.</p>
        <div class="field">
          <div class="control">
            <button class="button is-danger" type="submit">인수인계</button>
          </div>
        </div>
      </form>
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
      studentId: 0,
      name: '',
      disappointAllExecutives: false,
      unsubscribeAll: false,
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
          mutation($memberId: Int!, $disappointAllExecutives: Boolean!, unsubscribeAll: Boolean!) {
            handoverExecutive(memberId: $memberId, disappointAllEecutives: $disappointAllExecutives, unsubscribeAll: $unsubscribeAll)
          }
        `,
        variables: {
          memberId: member.data.getMemberByStudentId.id,
          disappointAllExecutives: this.disappointAllExecutives,
          unsubscribeAll: this.unsubscribeAll,
        },
      })

      this.$router.push('/')
    },
  },
})
</script>
