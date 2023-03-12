<template>
  <div>
    <h1 class="title">입부/재입부원서 접수 잠금</h1>
    <h2 class="subtitle">
      입부/재입부원서 접수를 더 이상 받지 않도록 잠글 수 있습니다.
    </h2>
    <div>
      <div class="notification">
        입부/재입부원서 접수를 잠그면 입부/재입부원서 접수기간 설정에
        <strong>상관없이</strong> 원서를 제출할 수 없습니다.
      </div>
      <form>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input
                id="lockApplications"
                v-model="locked"
                class="form-check-input"
                type="checkbox"
              />

              입부/재입부원서 접수 잠금
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button type="button" class="button is-primary" @click="setLock">
              저장
            </button>
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
  middleware: hasPermission('application.lock'),
  data() {
    return {
      locked: false,
    } as {
      locked: boolean
    }
  },
  apollo: {
    locked: {
      query: gql`
        query {
          isApplicationsLocked
        }
      `,
      update: (data) => data.isApplicationsLocked,
    },
  },
  methods: {
    async setLock() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($lock: Boolean!) {
            lockApplication(lock: $lock)
          }
        `,
        variables: {
          lock: this.locked,
        },
      })

      await this.$apollo.queries.locked.refetch()
    },
  },
})
</script>
