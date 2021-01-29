<template>
  <div>
    <notifications :notifications="notifications"> </notifications>
    <p v-if="isApplicated">
      <template v-if="applicationForm.reApplication">재</template>입부신청이
      성공적으로 접수됐습니다. 만약 2~3일 이후에도 연락이 오지 않는다면
      회장단에게 문자나 전화로 연락해주세요.<br />
    </p>
    <form v-else-if="isAdditionalQuestionsStep" @submit.prevent="doApply">
      <div
        v-for="question in additionalQuestions"
        :key="question.id"
        class="field"
      >
        <label :for="question.id" class="label">
          {{ question.question }}
          <sup v-if="question.required" style="color: red">*필수</sup>
        </label>
        <div class="field">
          <textarea
            :id="question.id"
            v-model="question.answer"
            class="textarea"
          ></textarea>
        </div>
      </div>
      <p class="answer-all-required">필수 질문은 반드시 모두 응답해주세요!</p>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button
            class="button"
            @click.prevent="isAdditionalQuestionsStep = false"
          >
            이전
          </button>
          <button class="button is-primary" type="submit">신청</button>
        </div>
      </div>
    </form>
    <form v-else @submit.prevent="doApplyOrContinue">
      <p>
        중앙대학교 서울캠퍼스 중앙동아리 만화두레에 오신 것을 환영합니다!<br />
        온라인 입부신청 중 오류 발생시 회장단에게 연락해주시기 바랍니다.
      </p>
      <div class="field">
        <label for="name" class="label">이름</label>
        <div class="control">
          <input
            id="name"
            v-model="name"
            class="input"
            type="text"
            placeholder="예시: 김만두"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="studentId" class="label">학번</label>
        <div class="control">
          <input
            id="studentId"
            v-model.number="studentId"
            class="input"
            type="number"
            name="studentId"
            placeholder="예시: 19871234"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="department" class="label">학과</label>
        <div class="control">
          <input
            id="department"
            v-model="department"
            class="input"
            type="text"
            name="department"
            placeholder="예시: 만화창작학과"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="birthday" class="label">생일</label>
        <div class="control">
          <input
            id="birthday"
            v-model="birthday"
            class="input"
            type="date"
            name="birthday"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="phoneNumber" class="label">전화번호</label>
        <div class="control">
          <tel-input
            id="phoneNumber"
            v-model="phoneNumber"
            class="input"
            placeholder="예시: 010-0000-0000"
            required
          />
          <p class="help">
            하이픈(-)은 자동으로 입력됩니다. 숫자만 입력해주세요.
          </p>
        </div>
      </div>
      <div class="level is-mobile">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">
                  {{ additionalQuestions.length === 0 ? '신청' : '다음' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <loading-modal :active="this.$apollo.loading" />
  </div>
</template>

<style scope>
.avatar-help {
  text-align: center;
}
.answer-all-required {
  font-size: 0.8em;
  text-align: right;
  color: red;
}
</style>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import TelInput from '~/components/telInput.vue'
import LoadingModal from '~/components/loadingModal.vue'
import Notifications from '~/components/notifications.vue'

export default Vue.extend({
  components: { TelInput, LoadingModal, Notifications },
  layout: 'default-wide',
  data() {
    return {
      phoneNumber: '',
      department: '',
      name: '',
      birthday: '',
      studentId: '',
      isApplicated: false,
      applicationForm: {
        applicationId: '',
        reApplication: false,
        applicationDate: '',
      },
      isAdditionalQuestionsStep: false,
      additionalQuestions: [],
      notifications: [] as any[],
    }
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '입부신청')
  },
  apollo: {
    additionalQuestions: {
      query: gql`
        query {
          applicationFormAdditionalQuestions {
            id
            question
            required
          }
        }
      `,
      update: (data) =>
        data.applicationFormAdditionalQuestions.map(
          (i: { id: string; question: string; required: boolean }) => {
            return {
              id: i.id,
              question: i.question,
              required: i.required,
              answer: '',
            }
          }
        ),
    },
  },
  methods: {
    async doApplyOrContinue() {
      if (this.additionalQuestions.length === 0) await this.doApply()
      else this.isAdditionalQuestionsStep = true
    },
    async doApply() {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $form: ApplicationFormInput!
            $additionalAnswers: [ApplicationFormAdditionalAnswerInput!]!
          ) {
            apply(form: $form, additionalAnswers: $additionalAnswers) {
              reApplication
            }
          }
        `,
        variables: {
          form: {
            phoneNumber: this.phoneNumber,
            department: this.department,
            name: this.name,
            birthday: this.birthday,
            studentId: this.studentId,
          },
          additionalAnswers: this.additionalQuestions.map((i: any) => {
            return {
              questionId: i.id,
              answer: i.answer,
            }
          }),
        },
        errorPolicy: 'all',
      })

      if (result.errors && result.errors.length > 0) {
        this.notifications = this.notifications.concat(
          result.errors.map((i) => {
            return {
              type: 'danger',
              message: i.message,
              until: Date.now() + 3000,
            }
          })
        )
        this.isAdditionalQuestionsStep = false
        return
      }
      this.isApplicated = true
      const { reApplication } = result.data.apply
      this.applicationForm.reApplication = reApplication
    },
  },
})
</script>
