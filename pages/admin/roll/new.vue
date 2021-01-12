<template>
  <div>
    <h1 class="title">회원추가</h1>
    <h2 class="subtitle">회원을 직접 추가합니다.</h2>
    <fade-transition>
      <div v-if="createdMemberId" class="notification is-primary">
        추가됐습니다.
        <nuxt-link :to="`/admin/roll/${createdMemberId}`">여기</nuxt-link>서
        확인해보세요.
      </div>
    </fade-transition>
    <form @submit.prevent="doAdd">
      <div class="field">
        <label for="memberType" class="label">회원유형</label>
        <div class="control">
          <div class="select">
            <select id="memberType" v-model="memberType">
              <option
                v-for="(description, value) in MemberTypeDescription"
                :key="'mem_' + value"
                :value="value"
              >
                {{ description }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <label for="schoolRegisterationStatus" class="label">학적</label>
        <div class="control">
          <div class="select">
            <select
              id="schoolRegisterationStatus"
              v-model="schoolRegisterationStatus"
            >
              <option
                v-for="(description,
                value) in SchoolRegisterationStatusDescription"
                :key="'school_' + value"
                :value="value"
              >
                {{ description }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <label for="name" class="label">이름</label>
        <div class="control">
          <input id="name" v-model="name" type="text" class="input" />
        </div>
      </div>
      <div class="field">
        <label for="department" class="label">학과</label>
        <div class="control">
          <input
            id="department"
            v-model="department"
            type="text"
            class="input"
          />
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
        <label for="phoneNumber" class="label">전화번호</label>
        <div class="control">
          <tel-input id="phoneNumber" v-model="phoneNumber" class="input" />
        </div>
      </div>
      <div class="field">
        <label for="birthday" class="label">생일</label>
        <div class="control">
          <input id="birthday" v-model="birthday" type="date" class="input" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary">추가</button>
        </div>
      </div>
    </form>
  </div>
</template>

style

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import TelInput from '~/components/telInput.vue'
import {
  SchoolRegisterationStatusDescription,
  MemberTypeDescription,
} from '~/components/EnumDescriptions'
import FadeTransition from '~/components/fadeTransition.vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  layout: 'admin',
  components: { TelInput, FadeTransition },
  middleware: hasPermission('roll.create'),
  data() {
    return {
      SchoolRegisterationStatusDescription,
      MemberTypeDescription,
      memberType: '',
      schoolRegisterationStatus: '',
      name: '',
      department: '',
      studentId: 0,
      phoneNumber: '',
      birthday: '',
      createdMemberId: null as null | string,
    }
  },
  methods: {
    async doAdd() {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($data: MemberRecordInput!) {
            createMember(data: $data) {
              id
            }
          }
        `,
        variables: {
          data: {
            memberType: this.memberType,
            schoolRegisterationStatus: this.schoolRegisterationStatus,
            name: this.name,
            department: this.department,
            studentId: this.studentId,
            phoneNumber: this.phoneNumber,
            birthday: this.birthday,
          },
        },
      })

      this.createdMemberId = result.data.createMember.id
      setTimeout(() => {
        this.createdMemberId = null
      }, 5000)
    },
  },
})
</script>
