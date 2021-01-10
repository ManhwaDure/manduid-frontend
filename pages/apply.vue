<template>
  <div>
    <p v-if="isApplicated">
      <template v-if="applicationForm.reApplication">재</template>입부신청이
      성공적으로 접수됐습니다. 만약 2~3일 이후에도 연락이 오지 않는다면
      회장단에게 문자나 전화로 연락해주세요.<br />
    </p>
    <form v-else @submit.prevent="doApply">
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
                <button class="button is-primary" type="submit">신청</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scope>
.avatar-help {
  text-align: center;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import TelInput from '~/components/telInput.vue'

export default Vue.extend({
  components: { TelInput },
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
    }
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '입부신청')
  },
  methods: {
    async doApply() {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($form: ApplicationFormInput!) {
            apply(form: $form) {
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
        },
      })

      this.isApplicated = true
      const { reApplication } = result.data.apply
      this.applicationForm.reApplication = reApplication
    },
  },
})
</script>
