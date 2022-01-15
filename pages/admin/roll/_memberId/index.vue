<template>
  <div>
    <h1 class="title">회원조회</h1>
    <h2 class="subtitle">특정 회원의 정보를 조회합니다.</h2>
    <p>
      2021년 초 시스템 업데이트 이후 기본사항 수정시 언제 어떤 이유로 수정됐는지
      수정내역이 기록됩니다. 따라서 기본사항의 이전 기록들을 조회할 수
      있습니다.<br />
      기본사항 외 다른 사항들은 수정내역이 기록되지 않습니다.
    </p>
    <br />
    <h3 class="title is-4">기본사항</h3>
    <h4 class="subtitle is-6">회원에 대한 기본적인 정보</h4>
    <table class="table is-hoverable is-bordered is-fullwidth is-striped">
      <thead>
        <tr class="has-text-centered">
          <th colspan="2">
            기본사항 (<template v-if="recordIndex === 1">최신판</template>
            <template v-else>
              <strong style="color: red">
                {{ memberCurrentRecordCreatedAt }}판, 최신판 아님!
              </strong> </template
            >)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>이름</th>
          <td>{{ memberCurrentRecord.name }}</td>
        </tr>
        <tr>
          <th>명부</th>
          <td>
            {{ MemberTypeDescription[memberCurrentRecord.memberType] }}
          </td>
        </tr>
        <tr>
          <th>학과</th>
          <td>{{ memberCurrentRecord.department }}</td>
        </tr>
        <tr>
          <th>학적</th>
          <td>
            {{
              SchoolRegisterationStatusDescription[
                memberCurrentRecord.schoolRegisterationStatus
              ]
            }}
          </td>
        </tr>
        <tr>
          <th>학번</th>
          <td>{{ memberCurrentRecord.studentId }}</td>
        </tr>
        <tr>
          <th>전화번호</th>
          <td>{{ memberCurrentRecord.phoneNumber }}</td>
        </tr>
        <tr>
          <th>생일</th>
          <td>{{ memberCurrentRecord.birthday }}</td>
        </tr>
        <tr>
          <th>비고 밑 특이사항</th>
          <td style="white-space: pre-wrap">{{ memberCurrentRecord.memo }}</td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th colspan="2" class="has-text-centered">수정정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2" class="has-text-centered">
            이 판은 아래 회원이 아래 일시에 아래와 같은 사유로 생성 및
            수정됐습니다.
          </td>
        </tr>
        <tr>
          <th>수정자</th>
          <td>
            <nuxt-link
              v-if="memberCurrentRecord.creator"
              :to="`/admin/roll/${memberCurrentRecord.creator.id}`"
            >
              {{ memberCurrentRecord.creator.name }}
            </nuxt-link>
            <span v-else
              ><del>(기록없음)</del
              ><sup
                >데이터베이스를 직접 수정하여 변경한 경우 수정자 기록이 누락될
                수 있습니다.</sup
              ></span
            >
          </td>
        </tr>
        <tr>
          <th>수정일시</th>
          <td>{{ memberCurrentRecordCreatedAt }}</td>
        </tr>
        <tr>
          <th>수정사유</th>
          <td>{{ memberCurrentRecord.creationReason }}</td>
        </tr>
      </tbody>
    </table>
    <pagination
      v-if="member.previousRecords.length !== 0"
      v-model="recordIndex"
      :maximum="1 + member.previousRecords.length"
    />
    <nuxt-link :to="`/admin/roll/${$route.params.memberId}/edit`" class="button"
      >수정</nuxt-link
    >
    <h3 class="title is-4">권한정보</h3>
    <h4 class="subtitle is-6">회원의 권한에 대한 정보</h4>
    <table class="table is-hoverable is-bordered is-striped">
      <tbody>
        <tr>
          <th>회장여부</th>
          <td>{{ member.isPresident ? '네' : '아니요' }}</td>
        </tr>
        <tr>
          <th>집행부원 여부</th>
          <td>
            {{
              member.isExecutive ? `네(${member.executiveTypeName}` : '아니요'
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <h3 class="title is-4">웹사이트 로그인 ID 및 프로필</h3>
    <h4 class="subtitle is-6">해당 회원의 웹사이트 로그인 ID 및 프로필</h4>
    <template v-if="member.ssoUserId || member.profile">
      <table class="table is-hoverable is-striped is-bordered">
        <tbody>
          <tr>
            <th>로그인 ID</th>
            <td>{{ member.ssoUserId }}</td>
          </tr>
          <tr>
            <th>닉네임</th>
            <td>{{ member.profile.nickname }}</td>
          </tr>
          <tr>
            <th>자기소개</th>
            <td>{{ member.profile.introduction }}</td>
          </tr>
          <tr>
            <th>개인 웹사이트</th>
            <td>{{ member.profile.website }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>
        로그인 ID 및 프로필 정보가 없습니다. 로그인 ID 및 프로필 정보는 해당
        회원이 웹사이트에 회원가입을 한 경우에만 존재합니다.
      </p>
    </template>
    <loading-modal
      text="회원정보를 불러오고 있습니다."
      :active="$apollo.loading"
    />
  </div>
</template>

style

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import {
  SchoolRegisterationStatusDescription,
  MemberTypeDescription,
} from '~/components/EnumDescriptions'
import LoadingModal from '~/components/loadingModal.vue'
import Pagination from '~/components/pagination.vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  layout: 'admin',
  components: { LoadingModal, Pagination },
  middleware: hasPermission('roll.list'),
  data() {
    return {
      SchoolRegisterationStatusDescription,
      MemberTypeDescription,
      recordIndex: 1,
      member: {
        memberType: '',
        schoolRegisterationStatus: '',
        name: '',
        department: '',
        memo: '',
        studentId: 0,
        phoneNumber: '',
        birthday: '',
        createdMemberId: null as null | string,
        id: 0,
        createdAt: '',
        creationReason: '',
        isExecutive: false,
        isPresident: false,
        previousRecords: [],
        executiveTypeName: null as null | string,
        creator: null as null | { id: number; name: string },
        ssoUserId: null as null | string,
        profile: null as null | {
          nickname: string
          website: string
          introduction: string
        },
      },
    }
  },
  computed: {
    memberCurrentRecord(): any {
      return this.recordIndex === 1
        ? this.member
        : this.member.previousRecords[
            this.member.previousRecords.length - this.recordIndex + 1
          ]
    },
    memberCurrentRecordCreatedAt(): string {
      const date = new Date(this.memberCurrentRecord.createdAt)
      return date.toLocaleString()
    },
  },
  apollo: {
    member: {
      query: gql`
        query($id: Int!) {
          getMemberById(memberId: $id) {
            id
            memberType
            schoolRegisterationStatus
            createdAt
            creationReason
            name
            department
            studentId
            phoneNumber
            birthday
            isExecutive
            isPresident
            executiveTypeName
            memo
            previousRecords {
              memberType
              schoolRegisterationStatus
              createdAt
              creationReason
              creator {
                id
                name
              }
              name
              department
              studentId
              phoneNumber
              birthday
              isExecutive
              isPresident
              memo
            }
            creator {
              id
              name
            }
            ssoUserId
            profile {
              nickname
              website
              introduction
            }
          }
        }
      `,
      update: (data) => data.getMemberById,
      variables() {
        return {
          id: parseInt(this.$route.params.memberId),
        }
      },
    },
  },
})
</script>
