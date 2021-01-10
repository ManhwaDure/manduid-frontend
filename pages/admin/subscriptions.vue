<template>
  <div>
    <div class="table-container">
      <h1 class="title">구독</h1>
      <h2 class="subtitle">
        입부원서 접수 등 이벤트 발생시 이메일 등으로 빠르게 알 수 있습니다.
      </h2>
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>이름</th>
            <th>학과</th>
            <th>학번</th>
            <th>구독대상</th>
            <th>구독방법</th>
            <th>동작</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="subscription in subscriptions"
            :key="subscription.toString()"
          >
            <td>{{ subscription.subscriptor.name }}</td>
            <td>{{ subscription.subscriptor.department }}</td>
            <td>{{ subscription.subscriptor.studentId }}</td>
            <td>{{ descriptions[subscription.target] }}</td>
            <td>{{ descriptions[subscription.method] }}</td>
            <td>
              <button
                class="button is-small is-danger"
                @click.prevent="removeSubscription(subscription)"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="box">
      <form @submit.prevent="createSubscription">
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
          <label for="target" class="label">구독대상</label>
          <div class="control">
            <div class="select">
              <select id="target" v-model="target">
                <option value="NewApplicationForm">신규 입부/재입부원서</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label for="method" class="label">구독방법</label>
          <div class="control">
            <div class="select">
              <select id="method" v-model="method">
                <option value="Email">이메일</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button type="submit" class="button is-primary">구독 추가</button>
          </div>
        </div>
      </form>
    </div>
    <loading-modal :active="$apollo.loading" />
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import LoadingModal from '~/components/loadingModal.vue'
export default Vue.extend({
  layout: 'admin',
  components: { LoadingModal },
  data() {
    return {
      descriptions: {
        NewApplicationForm: '신규 입부/재입부원서',
        Email: '이메일',
      },
      subscriptions: [],
      name: '',
      studentId: 0,
      method: 'Email',
      target: 'NewApplicationForm',
    }
  },
  apollo: {
    subscriptions: {
      query: gql`
        query {
          subscriptions {
            subscriptor {
              id
              name
              studentId
              department
            }
            method
            target
          }
        }
      `,
      update: (data) => data.subscriptions,
    },
  },
  methods: {
    async createSubscription() {
      const getMemberResult = await this.$apollo.query({
        query: gql`
          query($name: String!, $studentId: Int!) {
            getMemberByStudentId(name: $name, studentId: $studentId) {
              id
            }
          }
        `,
        variables: {
          name: this.name,
          studentId: this.studentId,
        },
      })

      if (getMemberResult.data.getMemberByStudentId === null)
        return alert('학번이나 이름을 잘못 입력하셨습니다.')
      const { id } = getMemberResult.data.getMemberByStudentId

      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $id: Int!
            $target: SubscriptionTarget!
            $method: SubscriptionMethod!
          ) {
            createSubscription(
              subscriptorId: $id
              target: $target
              method: $method
            ) {
              target
            }
          }
        `,
        variables: {
          id,
          target: this.target,
          method: this.method,
        },
      })

      await this.$apollo.queries.subscriptions.refetch()
    },
    async removeSubscription(subscription: any) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $id: Int!
            $target: SubscriptionTarget!
            $method: SubscriptionMethod!
          ) {
            deleteSubscription(
              subscriptorId: $id
              target: $target
              method: $method
            ) {
              target
            }
          }
        `,
        variables: {
          id: subscription.subscriptor.id,
          target: subscription.target,
          method: subscription.method,
        },
      })

      await this.$apollo.queries.subscriptions.refetch()
    },
  },
})
</script>
