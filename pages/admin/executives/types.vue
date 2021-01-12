<template>
  <div>
    <h1 class="title">집행부원 직책 관리</h1>
    <h2 class="subtitle">집행부원의 직책을 관리합니다.</h2>
    <fade-transition>
      <div
        v-for="message in successMessages"
        :key="message"
        class="notification is-success"
      >
        {{ message }}
      </div>
    </fade-transition>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>직책이름</th>
        <th>동작</th>
      </thead>
      <tbody>
        <tr v-for="executiveType in executiveTypes" :key="executiveType.name">
          <td>{{ executiveType.name }}</td>
          <td>
            <button
              class="button"
              @click.prevent="
                showUpdatePermissionsModal(
                  executiveType.name,
                  executiveType.permissions
                )
              "
            >
              권한 변경
            </button>
            <button
              class="button"
              @click.prevent="renameExecutiveType(executiveType.name)"
            >
              이름 변경
            </button>
            <button
              class="button is-danger"
              @click.prevent="deleteExecutiveType(executiveType.name)"
            >
              삭제
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <form @submit.prevent="createExecutiveType">
              <input
                v-model="newExecutiveTypeName"
                type="text"
                class="input"
                placeholder="새로운 직책 이름"
                aria-label="새로운 직책 이름"
              />
            </form>
          </td>
          <td>
            <button
              class="button is-primary"
              @click.prevent="createExecutiveType"
            >
              생성
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <loading-modal :active="$apollo.loading" />
    <div class="modal" :class="{ 'is-active': isPermissionModalActive }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <h3 class="title is-6">
            권한 변경 ({{ currentExecutiveTypeOnModal }})
          </h3>
          <div class="container-fluid permission-container">
            <div class="table-container">
              <table class="table is-hoverable is-fullwidth">
                <thead>
                  <th>부여</th>
                  <th>시스템 권한</th>
                  <th>설명</th>
                </thead>
                <tbody>
                  <tr
                    v-for="permission in permissionDescriptions"
                    :key="permission.name"
                  >
                    <td>
                      <input
                        v-model="newPermissions"
                        type="checkbox"
                        :value="permission.name"
                      />
                    </td>
                    <td>{{ permission.name }}</td>
                    <td>{{ permission.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <div class="field is-grouped is-grouped-right">
            <div class="field">
              <button
                class="button"
                @click.prevent="() => (isPermissionModalActive = false)"
              >
                닫기
              </button>
              <button
                class="button is-primary"
                @click.prevent="
                  updatePermissions(currentExecutiveTypeOnModal, newPermissions)
                "
              >
                변경
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="닫기"
        @click.prevent="() => (isPermissionModalActive = false)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
tbody td {
  vertical-align: middle;
}
thead th {
  word-break: keep-all;
}
.permission-container {
  overflow-y: scroll;
  height: calc(100vh - 200px);
}
</style>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import LoadingModal from '~/components/loadingModal.vue'
import FadeTransition from '~/components/fadeTransition.vue'
import hasPermission from '~/middleware/hasPermission'
export default Vue.extend({
  layout: 'admin',
  middleware: hasPermission('executive.type'),
  components: {
    LoadingModal,
    FadeTransition,
  },
  data() {
    return {
      studentId: 0,
      name: '',
      executiveTypes: [],
      newExecutiveTypeName: '',
      successMessages: [] as string[],
      permissionDescriptions: [],
      isPermissionModalActive: false,
      currentExecutiveTypeOnModal: '',
      newPermissions: [] as string[],
    }
  },
  apollo: {
    executiveTypes: {
      query: gql`
        query {
          executiveTypes {
            name
            permissions
          }
        }
      `,
      update: (data) => data.executiveTypes,
    },
    permissionDescriptions: {
      query: gql`
        query {
          permissionDescriptions {
            name
            description
          }
        }
      `,
      update: (result) => result.permissionDescriptions,
    },
  },
  methods: {
    showSucessNotification(message: string) {
      this.successMessages.push(message)
      setTimeout(() => this.successMessages.shift(), 5000)
    },
    async createExecutiveType() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!) {
            createExecutiveType(name: $name) {
              name
            }
          }
        `,
        variables: {
          name: this.newExecutiveTypeName,
        },
      })

      await this.$apollo.queries.executiveTypes.refetch()

      this.showSucessNotification(
        `직책 ${this.newExecutiveTypeName}을(를) 성공적으로 추가했습니다.`
      )

      this.newExecutiveTypeName = ''
    },
    showUpdatePermissionsModal(typename: string, permissions: string[]) {
      this.currentExecutiveTypeOnModal = typename
      this.newPermissions = permissions
      this.isPermissionModalActive = true
    },
    async updatePermissions(typename: string, permissions: string[]) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!, $permissions: [String!]!) {
            updatePermission(
              executiveTypeName: $name
              permissions: $permissions
            ) {
              name
            }
          }
        `,
        variables: {
          name: typename,
          permissions,
        },
      })

      await this.$apollo.queries.executiveTypes.refetch()

      this.isPermissionModalActive = false

      this.showSucessNotification(
        `직책 ${typename}의 권한을 성공적으로 변경했습니다.`
      )
    },
    async deleteExecutiveType(typename: string) {
      if (!confirm(`정말로 ${typename} 직책을 삭제하시겠습니까?`)) return
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($typename: String!) {
            deleteExecutiveType(name: $typename)
          }
        `,
        variables: {
          typename,
        },
      })

      if (result) {
        this.showSucessNotification(
          `직책 ${typename}을(를) 성공적으로 삭제했습니다.`
        )
      }
      await this.$apollo.queries.executiveTypes.refetch()
    },
    async renameExecutiveType(typename: string) {
      const newName = prompt('새로운 이름을 입력하세요')
      if (newName === null) return
      await this.$apollo.mutate({
        mutation: gql`
          mutation($oldName: String!, $newName: String!) {
            renameExecutiveType(oldName: $oldName, newName: $newName) {
              name
            }
          }
        `,
        variables: {
          oldName: typename,
          newName,
        },
      })

      this.showSucessNotification(
        `직책 ${typename}의 이름을 성공적으로 ${newName}으로 변경했습니다.`
      )

      await this.$apollo.queries.executiveTypes.refetch()
    },
  },
})
</script>
