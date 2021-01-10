<template>
  <div>
    <h1 class="title">회원명부</h1>
    <h2 class="subtitle">만화두레의 회원목록을 확인합니다.</h2>
    <div class="box">
      <div class="field is-horizontal">
        <div class="field-label">
          <label for="memberTypes" class="label">명부</label>
        </div>
        <div id="memberTypes" class="field-body">
          <div class="field">
            <div class="control">
              <label
                v-for="(description, value) in MemberTypeDescription"
                :key="value"
                class="checkbox"
                ><input
                  v-model="filter.memberTypes"
                  type="checkbox"
                  :value="value"
                />&nbsp;{{ description }}&nbsp;</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label">
          <label for="schoolRegisterationStatues" class="label">학적</label>
        </div>
        <div id="schoolRegisterationStatues" class="field-body">
          <div class="field">
            <div class="control">
              <label
                v-for="(description,
                value) in SchoolRegisterationStatusDescription"
                :key="value"
                class="checkbox"
                ><input
                  v-model="filter.schoolRegisterationStatuses"
                  type="checkbox"
                  :value="value"
                />&nbsp;{{ description }}&nbsp;</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label">
          <label for="query" class="label">검색어</label>
        </div>
        <div class="field-body">
          <div class="field has-addons">
            <p class="control">
              <span class="select">
                <select v-model="filter.queryType">
                  <option value="name" selected>성명</option>
                  <option value="studentId">학번</option>
                  <option value="department">학과</option>
                  <option value="phoneNumber">전화번호</option>
                  <option value="userId">계정ID</option>
                </select>
              </span>
            </p>
            <p class="control is-expanded">
              <input v-model="filter.query" type="text" class="input" />
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label"></div>
        <div class="field-body">
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-primary" @click.prevent="saveAsExcel">
                엑셀 저장
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <member-table :members="filteredMembers" />
    <loading-modal
      text="회원명부를 불러오고 있습니다. 잠시만 기다려주세요."
      :active="this.$apollo.loading"
    />
  </div>
</template>

<style scoped>
.vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import xlsx from 'xlsx'
import LoadingModal from '~/components/loadingModal.vue'
import {
  SchoolRegisterationStatusDescription,
  MemberTypeDescription,
  SchoolRegisterationStatus,
  MemberType,
} from '~/components/EnumDescriptions'
import MemberTable from '~/components/memberTable.vue'

type MemberDataType = {
  id: number
  memberType: MemberType
  name: string
  department: string
  schoolRegisterationStatus: SchoolRegisterationStatus
  studentId: number
  phoneNumber: string
  ssoUserId: string | null
}
type VueDataType = {
  members: MemberDataType[]
  filter: {
    memberTypes: string[]
    schoolRegisterationStatuses: string[]
    queryType: 'name' | 'studentId' | 'department' | 'phoneNumber' | 'userId'
    query: string
  }
  SchoolRegisterationStatusDescription: {
    [key in SchoolRegisterationStatus]: string
  }
  MemberTypeDescription: { [key in MemberType]: string }
}

export default Vue.extend({
  components: { LoadingModal, MemberTable },
  middleware: 'isAuthenticated',
  layout: 'admin',
  data(): VueDataType {
    return {
      members: [],
      filter: {
        memberTypes: [],
        schoolRegisterationStatuses: [],
        queryType: 'name' as
          | 'name'
          | 'studentId'
          | 'department'
          | 'phoneNumber'
          | 'userId',
        query: '',
      },
      SchoolRegisterationStatusDescription,
      MemberTypeDescription,
    }
  },
  computed: {
    filteredMembers(): MemberDataType[] {
      return this.members.filter((i) => {
        if (
          this.filter.schoolRegisterationStatuses.length > 0 &&
          !this.filter.schoolRegisterationStatuses.includes(
            i.schoolRegisterationStatus
          )
        )
          return false
        if (
          this.filter.memberTypes.length > 0 &&
          !this.filter.memberTypes.includes(i.memberType)
        )
          return false
        if (this.filter.query.trim().length !== 0) {
          switch (this.filter.queryType) {
            case 'name':
              return i.name.includes(this.filter.query)
            case 'studentId':
              return i.studentId.toString().includes(this.filter.query)
            case 'department':
              return i.department.includes(this.filter.query)
            case 'phoneNumber':
              return i.phoneNumber
                .replace(/[^0-9]/g, '')
                .includes(this.filter.query.replace(/[^0-9]/g, ''))
            case 'userId':
              return i.ssoUserId
                ? i.ssoUserId.includes(this.filter.query.toLowerCase())
                : false
          }
        }

        return true
      })
    },
    excelData(): { [key: string]: string | number }[] {
      return this.filteredMembers.map((i: MemberDataType) => {
        return {
          명부: MemberTypeDescription[i.memberType],
          이름: i.name,
          학과: i.department,
          학적:
            SchoolRegisterationStatusDescription[i.schoolRegisterationStatus],
          학번: i.studentId,
          전화번호: i.phoneNumber,
          '계정 ID': i.ssoUserId || '',
        }
      })
    },
  },
  apollo: {
    members: gql`
      query {
        members {
          id
          memberType
          name
          department
          schoolRegisterationStatus
          studentId
          phoneNumber
          ssoUserId
        }
      }
    `,
  },
  methods: {
    async refreshList() {
      await this.$apollo.queries.members.refetch()
    },
    saveAsExcel() {
      const worksheet = xlsx.utils.json_to_sheet(this.excelData)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, '검색결과')
      xlsx.writeFile(workbook, '검색결과.xlsx', {
        bookType: 'xlsx',
      })
    },
  },
})
</script>
