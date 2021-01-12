<template>
  <div>
    <h1 class="title">입부/재입부원서 추가질문 관리</h1>
    <h2 class="subtitle">입부/재입부원서 추가질문을 관리합니다.</h2>
    <div class="table-container">
      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>질문내용</th>
            <th>필수여부</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="question in questions" :key="question.id">
            <td>{{ question.question }}</td>
            <td>{{ question.required ? 'Y' : 'N' }}</td>
            <td>
              <a
                href="#"
                class="button is-danger is-small"
                @click.prevent="deleteQuestion(question.id)"
                >삭제</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="box">
      <form @submit.prevent="createQuestion">
        <div class="field">
          <label for="newQuestion" class="label">질문할 내용</label>
          <div class="control">
            <textarea
              id="newQuestion"
              v-model="newQuestion"
              class="textarea"
            ></textarea>
          </div>
          <p class="help">
            참고 : 모든 추가질문은 장문으로 응답하는 질문으로 만들어집니다.
          </p>
        </div>
        <div class="field">
          <div class="control">
            <label for="newQuestionRequired" class="checkbox">
              <input
                id="newQuestionRequired"
                v-model="newQuestionRequired"
                type="checkbox"
              />
              필수 질문
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary" type="submit">질문 추가</button>
          </div>
        </div>
      </form>
    </div>
    <loading-modal :active="$apollo.loading"></loading-modal>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import LoadingModal from '~/components/loadingModal.vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  layout: 'admin',
  components: { LoadingModal },
  middleware: hasPermission('application.additionalQuestion'),
  data() {
    return {
      questions: [],
      newQuestion: '',
      newQuestionRequired: false,
    }
  },
  apollo: {
    questions: {
      query: gql`
        query {
          applicationFormAdditionalQuestions {
            id
            question
            required
          }
        }
      `,
      update: (data) => data.applicationFormAdditionalQuestions,
    },
  },
  methods: {
    async createQuestion() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($question: String!, $required: Boolean!) {
            createApplicationFormAdditionalQuestion(
              question: $question
              required: $required
            ) {
              id
            }
          }
        `,
        variables: {
          question: this.newQuestion,
          required: this.newQuestionRequired,
        },
      })

      await this.$apollo.queries.questions.refetch()
    },
    async deleteQuestion(questionId: string) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($questionId: ID!) {
            deleteApplicationFormAdditionalQuestion(id: $questionId) {
              id
            }
          }
        `,
        variables: {
          questionId,
        },
      })

      await this.$apollo.queries.questions.refetch()
    },
  },
})
</script>
