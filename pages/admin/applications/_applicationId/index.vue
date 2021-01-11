<template>
  <div>
    <h1 class="title">입부원서 목록</h1>
    <h2 class="subtitle">온라인으로 접수된 입부원서 목록입니다.</h2>
    <fade-transition>
      <div v-if="this.processed" class="notification is-success">
        성공적으로 처리됐습니다.
      </div>
    </fade-transition>
    <div class="table-container">
      <table class="table is-hoverable is-striped is-fullwidth">
        <thead>
          <tr class="has-text-centered">
            <th colspan="2">입부원서</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>유형</th>
            <td>{{ application.reApplication ? '재입부' : '입부' }}</td>
          </tr>
          <tr>
            <th>성명</th>
            <td>{{ application.name }}</td>
          </tr>
          <tr>
            <th>학번</th>
            <td>{{ application.studentId }}</td>
          </tr>
          <tr>
            <th>학과</th>
            <td>{{ application.department }}</td>
          </tr>
          <tr>
            <th>생일</th>
            <td>{{ application.birthday }}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td>{{ application.phoneNumber }}</td>
          </tr>
        </tbody>

        <thead>
          <tr class="has-text-centered">
            <th colspan="2">추가질문</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="application.additionalAnswers.length === 0"
            class="has-text-centered"
          >
            <td colspan="2">없음</td>
          </tr>
          <template v-for="answer in application.additionalAnswers" v-else>
            <tr :key="answer.question.id">
              <td colspan="2">
                <strong
                  >{{ answer.question.question
                  }}<sup v-if="answer.question.required" style="color: red"
                    >*필수</sup
                  ></strong
                >
              </td>
            </tr>
            <tr :key="answer.question.id + '_ans'">
              <td
                v-if="answer.answer === ''"
                colspan="2"
                style="color: darkgray"
              >
                답변 없음
              </td>
              <td v-else colspan="2">{{ answer.answer }}</td>
            </tr>
          </template>
        </tbody>

        <template v-if="application.acceptance">
          <thead>
            <tr class="has-text-centered">
              <th colspan="2">허가내역</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>허가여부</th>
              <td v-if="application.acceptance.accepted">
                <span style="color: green">허가됨</span>
              </td>
              <td v-else>
                <span style="color: red">불허됨</span>
              </td>
            </tr>
            <tr>
              <th>허가자</th>
              <td>
                <nuxt-link
                  :to="`/admin/roll/${application.acceptance.accepterId}`"
                  >{{ application.acceptance.accepterName }}</nuxt-link
                >
              </td>
            </tr>
            <tr>
              <th>허가일시</th>
              <td>{{ acceptedAt }}</td>
            </tr>
            <tr>
              <th>허가사유</th>
              <td>{{ application.acceptance.reason }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <form v-if="application.acceptance === null">
      <h3 class="title is-4">허가 및 불허</h3>
      <h4 class="subtitle is-6">이 입부원서를 허가하거나 불허합니다.</h4>
      <div class="field">
        <label for="reason" class="label">사유</label>
        <div class="control">
          <textarea id="reason" v-model="reason" class="textarea"></textarea>
        </div>
      </div>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <button
            class="is-danger button"
            @click.prevent="doAcceptOrRejectThis(false)"
          >
            불허
          </button>
        </p>
        <p class="control">
          <button
            class="is-primary button"
            @click.prevent="doAcceptOrRejectThis(true)"
          >
            허가
          </button>
        </p>
      </div>
    </form>
    <loading-modal :active="$apollo.loading" />
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import FadeTransition from '~/components/fadeTransition.vue'
import LoadingModal from '~/components/loadingModal.vue'

type VueDataType = {
  application: any
  reason: string
  processed: boolean
}
export default Vue.extend({
  layout: 'admin',
  components: { LoadingModal, FadeTransition },
  data(): VueDataType {
    return {
      application: { acceptance: {}, additionalAnswers: [] },
      reason: '',
      processed: false,
    }
  },
  computed: {
    acceptedAt(): string | null {
      if (this.application.acceptance) {
        const date = new Date(this.application.acceptance.acceptedAt)
        return date.toLocaleString()
      }
      return null
    },
  },
  methods: {
    async doAcceptOrRejectThis(accepts: boolean) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($id: String!, $accepts: Boolean!, $reason: String!) {
            acceptOrDenyApplication(
              applicationId: $id
              accepts: $accepts
              reason: $reason
            ) {
              applicationId
            }
          }
        `,
        variables: {
          id: this.application.applicationId,
          accepts,
          reason: this.reason,
        },
      })

      this.processed = true
      setTimeout(() => {
        this.processed = false
      }, 3000)
      await this.$apollo.queries.application.refetch()
    },
  },
  apollo: {
    application: {
      query: gql`
        query($id: String!) {
          getApplicationById(applicationId: $id) {
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
            additionalAnswers {
              answer
              question {
                id
                question
                required
              }
            }
          }
        }
      `,

      variables() {
        return {
          id: this.$route.params.applicationId,
        }
      },
      update: (result) => result.getApplicationById,
    },
  },
})
</script>
