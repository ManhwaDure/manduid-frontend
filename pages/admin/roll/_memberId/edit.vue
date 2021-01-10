<template>
  <div>
    <h1 class="title">회원수정</h1>
    <h2 class="subtitle">특정 회원의 기본사항을 수정합니다.</h2>
    <form @submit.prevent="doOpenModal">
      <div class="field">
        <label for="memberType" class="label">회원유형</label>
        <div class="control">
          <div class="select">
            <select id="memberType" v-model="data.memberType">
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
              v-model="data.schoolRegisterationStatus"
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
          <input id="name" v-model="data.name" type="text" class="input" />
        </div>
      </div>
      <div class="field">
        <label for="department" class="label">학과</label>
        <div class="control">
          <input
            id="department"
            v-model="data.department"
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
            v-model.number="data.studentId"
            type="number"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <label for="phoneNumber" class="label">전화번호</label>
        <div class="control">
          <tel-input
            id="phoneNumber"
            v-model="data.phoneNumber"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <label for="birthday" class="label">생일</label>
        <div class="control">
          <input
            id="birthday"
            v-model="data.birthday"
            type="date"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary">수정</button>
        </div>
      </div>
      <loading-modal
        text="기본사항을 불러오고 있습니다. 잠시만 기다려주세요."
        :active="$apollo.loading"
      />
    </form>
    <div class="modal" :class="{ 'is-active': reasonModalActive }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <div class="field">
            <label for="reason" class="label">수정 사유</label>
            <div class="control">
              <textarea
                id="reason"
                v-model="reason"
                class="textarea"
              ></textarea>
            </div>
          </div>
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-primary" @click.prevent="doUpdate">
                수정
              </button>
            </p>
            <p class="control">
              <button class="button" @click.prevent="doCloseModal">닫기</button>
            </p>
          </div>
        </div>
        <button
          class="modal-close is-large"
          aria-label="닫기"
          @click.prevent="doCloseModal"
        ></button>
      </div>
    </div>
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
  SchoolRegisterationStatus,
  MemberType,
} from '~/components/EnumDescriptions'
import LoadingModal from '~/components/loadingModal.vue'

type VueDataType = {
  SchoolRegisterationStatusDescription: {
    [key in SchoolRegisterationStatus]: string
  }
  MemberTypeDescription: { [key in MemberType]: string }
  reasonModalActive: boolean
  reason: string
  data: {
    memberType: string
    schoolRegisterationStatus: string
    name: string
    department: string
    studentId: number
    phoneNumber: string
    birthday: string
  }
}

export default Vue.extend({
  layout: 'admin',
  components: { TelInput, LoadingModal },
  data(): VueDataType {
    return {
      SchoolRegisterationStatusDescription,
      MemberTypeDescription,
      reasonModalActive: false,
      reason: '',
      data: {
        memberType: '',
        schoolRegisterationStatus: '',
        name: '',
        department: '',
        studentId: 0,
        phoneNumber: '',
        birthday: '',
      },
    }
  },
  apollo: {
    data: {
      query: gql`
        query($id: Int!) {
          getMemberById(memberId: $id) {
            memberType
            schoolRegisterationStatus
            name
            department
            studentId
            phoneNumber
            birthday
          }
        }
      `,
      variables() {
        return {
          id: parseInt(this.$route.params.memberId),
        }
      },
      update: (result) => result.getMemberById,
    },
  },
  methods: {
    doOpenModal(): void {
      this.reasonModalActive = true
    },
    doCloseModal(): void {
      this.reasonModalActive = false
    },
    async doUpdate(): Promise<void> {
      const {
        memberType,
        schoolRegisterationStatus,
        name,
        department,
        studentId,
        phoneNumber,
        birthday,
      } = this.data
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $memberId: Int!
            $data: MemberRecordInput!
            $reason: String!
          ) {
            updateMember(memberId: $memberId, data: $data, reason: $reason) {
              id
            }
          }
        `,
        variables: {
          memberId: parseInt(this.$route.params.memberId),
          data: {
            memberType,
            schoolRegisterationStatus,
            name,
            department,
            studentId,
            phoneNumber,
            birthday,
          },
          reason: this.reason || '',
        },
      })
      await this.$router.push(`/admin/roll/${result.data.updateMember.id}`)
    },
  },
})
</script>
