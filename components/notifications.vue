<template>
  <fade-transition>
    <div
      v-for="notification in activeNotifications()"
      :key="notification.until + notification.message"
      class="notification"
      :class="`is-` + notification.type"
    >
      {{ notification.message }}
    </div>
  </fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import FadeTransition from './fadeTransition.vue'

export interface NotificationItem {
  until: Date | number
  message: string
  type: 'warning' | 'success' | 'danger'
}

export default Vue.extend({
  components: { FadeTransition },
  props: {
    notifications: {
      type: Array,
      default: () => [] as Array<NotificationItem>,
      required: true,
      validator(value: Array<NotificationItem>) {
        for (const i of value) {
          if (
            (!(i.until instanceof Date) && typeof i.until !== 'number') ||
            typeof i.message !== 'string' ||
            typeof i.type !== 'string'
          ) {
            return false
          }
        }
        return true
      },
    },
    updateInterval: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      intervalHandle: null as NodeJS.Timeout | null,
    }
  },
  created() {
    this.intervalHandle = setInterval(() => {
      this.$forceUpdate()
    }, this.updateInterval)
  },
  destroyed() {
    if (this.intervalHandle !== null) clearInterval(this.intervalHandle)
  },
  methods: {
    activeNotifications(): Array<any> {
      return (this.notifications as NotificationItem[]).filter(
        (i) =>
          (typeof i.until === 'number'
            ? i.until
            : (i.until as Date).getTime()) > Date.now()
      )
    },
  },
})
</script>
