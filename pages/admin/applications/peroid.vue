<template>
  <div>
    <h1 class="title">입부/재입부원서 접수기간 관리</h1>
    <h2 class="subtitle">입부/재입부원서 접수기간을 설정할 수 있습니다.</h2>
    <div>
      <div class="notification">
        시작일과 중료일은 둘 다 설정할 수도 있고, 둘 다 설정 안할 수도 있으며,
        둘 중 하나만 설정할 수도 있습니다.
        <div class="content">
          <ul>
            <li>둘 다 설정하지 않은 경우: 상시모집입니다.</li>
            <li>
              시작일만 설정한 경우: 시작일이 다가오기 이전에는 입부/재입부원서를
              제출할 수 없습니다.
            </li>
            <li>
              종료일만 설정한 경우: 종료일이 지난 이후에는 입부/재입부원서를
              제출할 수 없습니다.
            </li>
            <li>
              둘 다 설정한 경우: 시작일과 종료일 사이에만 입부/재입부원서를
              제출할 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
      <form>
        <div class="field is-grouped">
          <label for="beginDate" class="label">접수 시작일</label>
          <div class="control">
            <input
              id="beginDate"
              v-model="peroid.begin"
              type="datetime-local"
              class="input"
            />
          </div>
          <div class="control">
            <a href="#" class="button" @click.prevent="setNull('begin')"
              >초기화</a
            >
          </div>
        </div>
        <div class="field is-grouped">
          <label for="endDate" class="label">접수 종료일</label>
          <div class="control">
            <input
              id="endDate"
              v-model="peroid.end"
              type="datetime-local"
              class="input"
            />
          </div>
          <div class="control">
            <a href="#" class="button" @click.prevent="setNull('end')"
              >초기화</a
            >
          </div>
        </div>
        <div class="field">
          <button type="button" class="button is-primary" @click="setPeroid">
            저장
          </button>
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
  middleware: hasPermission('application.setPeroid'),
  data() {
    return {
      peroid: {
        begin: null,
        end: null,
      },
    } as {
      peroid: {
        begin: null | string
        end: null | string
      }
    }
  },
  apollo: {
    peroid: {
      query: gql`
        query {
          applicationsBeginDate
          applicationsEndDate
        }
      `,
      update: (data) => {
        const convertDateToDateTimeStr = (d: Date) =>
          `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${d
            .getDate()
            .toString()
            .padStart(2, '0')}T${d
            .getHours()
            .toString()
            .padStart(2, '0')}:${d
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
        return {
          begin:
            data.applicationBeginDate !== null
              ? convertDateToDateTimeStr(new Date(data.applicationsBeginDate))
              : null,
          end:
            data.applicationEndDate !== null
              ? convertDateToDateTimeStr(new Date(data.applicationsEndDate))
              : null,
        }
      },
    },
  },
  methods: {
    setNull(beginOrEnd: 'begin' | 'end') {
      switch (beginOrEnd) {
        case 'begin':
          return (this.peroid.begin = null)
        case 'end':
          return (this.peroid.end = null)
      }
    },
    async setPeroid() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($begin: String, $end: String) {
            setApplicationPeroid(begin: $begin, end: $end)
          }
        `,
        variables: {
          begin:
            this.peroid.begin === null ||
            new Date(this.peroid.begin) < new Date('1987-01-01T00:00+09:00')
              ? null
              : new Date(this.peroid.begin + '+09:00').toISOString(),
          end:
            this.peroid.end === null ||
            new Date(this.peroid.end) < new Date('1987-01-01T00:00+09:00')
              ? null
              : new Date(this.peroid.end + '+09:00').toISOString(),
        },
      })

      await this.$apollo.queries.peroid.refetch()
    },
  },
})
</script>
