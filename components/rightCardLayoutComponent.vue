<template>
  <div class="is-fullsize">
    <div class="columns is-gapless is-fullsize">
      <div
        v-if="error"
        class="column with-error-background is-hidden-mobile"
      ></div>
      <div v-else class="column with-background is-hidden-mobile"></div>
      <div :class="colClass" style="min-width: 400px">
        <div class="container is-fluid with-top-padding">
          <div class="level is-mobile">
            <div class="levle-left">
              <div class="level-item">
                <h1 class="title">{{ title }}</h1>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <nuxt-link to="/">
                  <img
                    src="~/assets/logo.png"
                    alt="만화두레"
                    class="is-logo-img"
                  />
                </nuxt-link>
              </div>
            </div>
          </div>
          <slot> </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html,
body,
.is-fullsize:not(.columns) {
  width: 100%;
  height: 100%;
}
.is-fullsize.columns {
  width: 100%;
  min-height: 100%;
}
.with-background {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('~assets/background.jpg');
  background-size: cover;
  background-position: center;
}
.with-error-background {
  background: linear-gradient(rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.5)),
    url('~assets/background.jpg');
  background-size: cover;
  background-position: center;
}
.is-logo-img {
  width: 48px;
}
.with-top-padding {
  padding-top: 32px;
}
.is-shadowed {
  box-shadow: 1px 2px black;
}
.right-card {
  min-height: 100vh;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: { type: String, default: '만화두레' },
    error: Boolean,
    wide: Boolean,
  },
  computed: {
    colClass() {
      return this.wide
        ? 'column is-4-desktop is-5-tablet is-12-mobile is-shadowed right-card'
        : 'column is-3-desktop is-4-tablet is-12-mobile is-shadowed right-card'
    },
  },
})
</script>
