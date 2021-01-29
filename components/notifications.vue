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
export default Vue.extend({
  components: { FadeTransition },
  props: {
    notifications: {
      type: Array,
      default: () => [] as Array<any>,
      required: true,
      validator(value: Array<any>) {
        for (const i of value) {
          if (
            !(i.until instanceof Date) ||
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
      return this.notifications.filter((i) => i.until > Date.now())
    },
  },
})
</script>
