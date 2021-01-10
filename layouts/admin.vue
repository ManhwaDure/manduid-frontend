<template>
  <div class="columns admin-columns is-fullheight is-gapless">
    <div
      id="desktopMenu"
      class="column is-3-desktop is-4-tablet is-hidden-mobile .is-fullheight"
    >
      <div class="container is-fluid">
        <div class="logo-container">
          <nuxt-link to="/admin" style="color: inherit">
            <img src="~assets/logo.svg" alt="만화두레" title="만화두레" /><br />
            만화두레 회원관리
          </nuxt-link>
        </div>
        <aside class="menu">
          <template v-for="menu in menuData">
            <p v-if="menu.name" :key="menu.name" class="menu-label">
              {{ menu.name }}
            </p>
            <ul
              v-if="menu.items"
              :key="menu.name + '__items'"
              class="menu-list"
            >
              <ul>
                <li
                  v-for="item in menu.items"
                  :key="menu.name + '_' + item.name"
                >
                  <nuxt-link :to="item.href">{{ item.name }}</nuxt-link>
                  <ul v-if="item.items">
                    <li
                      v-for="subitem in item.items"
                      :key="menu.name + '_' + item.name + '_' + subitem.name"
                    >
                      <nuxt-link :to="subitem.href">{{
                        subitem.name
                      }}</nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </ul>
          </template>
        </aside>
        <p class="has-text-centered">
          <nuxt-link to="/logout" class="button is-danger">로그아웃</nuxt-link>
        </p>
      </div>
    </div>
    <div class="column content-column is-fullheight">
      <nav class="navbar is-hidden-tablet is-light">
        <div class="navbar-brand">
          <nuxt-link to="/admin" class="navbar-item">
            <img
              src="~assets/logo.svg"
              alt="만화두레"
              style="height: 1.5em"
            />&nbsp;만화두레 회원관리
          </nuxt-link>
          <a
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            :class="mobileNavbarClass"
            @click.prevent="toggleNavbarMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" :class="mobileNavbarClass">
          <div class="navbar-start">
            <div
              v-for="menu in menuData"
              :key="menu.name"
              class="navbar-item has-dropdown is-hoverable"
            >
              <a href="#" class="navbar-link">{{ menu.name }} </a>
              <div class="navbar-dropdown">
                <template v-for="item in menu.items">
                  <nuxt-link
                    :key="menu.name + '_' + item.name"
                    :to="menu.href || ''"
                    class="navbar-item"
                    >{{ item.name }}</nuxt-link
                  >
                  <template v-if="item.items">
                    <hr
                      :key="
                        menu.name + '_' + item.name + '_' + '__divider_first'
                      "
                      class="navbar-divider"
                    />
                    <nuxt-link
                      v-for="subitem in item.items"
                      :key="menu.name + '_' + item.name + '_' + subitem.name"
                      :to="subitem.href"
                      class="navbar-item"
                      >{{ subitem.name }}</nuxt-link
                    >
                    <hr
                      :key="
                        menu.name + '_' + item.name + '_' + '__divider_second'
                      "
                      class="navbar-divider"
                    />
                  </template>
                </template>
              </div>
            </div>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <nuxt-link to="/logout" class="button is-danger">
                <strong>로그아웃</strong>
              </nuxt-link>
            </div>
          </div>
        </div>
      </nav>
      <div class="container is-fluid content-container">
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<style scoped>
#desktopMenu {
  background: rgb(231, 231, 231);
}
.is-fullheight {
  min-height: 100vh;
}
.admin-columns > .column > .container {
  margin-top: 15px;
  margin-bottom: 15px;
}
.logo-container {
  margin-bottom: 15px;
}
.logo-container {
  text-align: center;
}
.logo-container img {
  height: 3.5rem;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      menuData: [
        {
          name: '회원관리',
          items: [
            { name: '회원추가', href: '/admin/roll/new' },
            {
              name: '회원명부',
              href: '/admin/roll',
            },
          ],
        },
        {
          name: '입부원서관리',
          items: [{ name: '입부/재입부원서', href: '/admin/applications' }],
        },
        {
          name: '집행부원 관리',
          items: [
            { name: '회장직 인수인계', href: '/admin/executives/handover' },
            { name: '집행부원 목록', href: '/admin/executives/list' },
            { name: '집행부원 선임', href: '/admin/executives/appoint' },
            { name: '집행부원직 관리', href: '/admin/executives/types' },
          ],
        },
        {
          name: '구독',
          items: [{ name: '이메일 구독 관리', href: '/admin/subscriptions' }],
        },
        {
          name: '시스템 관리',
          items: [
            { name: 'OpenID Connect 1.0 Client 관리', href: '/admin/oidc' },
          ],
        },
      ],
      mobileNavbarClass: {
        'is-active': false,
      },
    }
  },
  computed: {
    title() {
      return this.$accessor.rightCardLayout.title
    },
  },
  methods: {
    toggleNavbarMenu() {
      this.mobileNavbarClass['is-active'] = !this.mobileNavbarClass['is-active']
    },
  },
})
</script>
