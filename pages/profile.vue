<template>
  <div>
    <loading-icon
      v-if="this.$apollo.loading"
      text="프로필을 불러오고 있습니다."
    />
    <form v-else @submit.prevent="doUpdateProfile">
      <fade-transition>
        <div v-if="showChangedNotification" class="notification is-success">
          프로필이 수정됐습니다.
        </div>
      </fade-transition>
      <label for="avatarImg" class="label">아바타 사진</label>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <figure class="image is-128x128">
            <img
              :src="profile.avatarUrl"
              alt="아바타 이미지"
              class="avatarImg"
            />
          </figure>
        </p>
      </div>
      <!-- <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button" type="button">테스트</button>
        </p>
      </div> -->
      <p class="help avatar-help">
        현재 아바타 이미지 업로드 기능 개발중입니다.
        <a href="https://ko.gravatar.com" target="_blank">Gravatar</a>를
        이용하세요.
      </p>
      <div class="field">
        <label for="nickname" class="label">닉네임</label>
        <div class="control">
          <input
            id="nickname"
            v-model="profile.nickname"
            type="text"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <label for="website" class="label">웹사이트 주소</label>
        <div class="control">
          <input
            id="website"
            v-model="profile.website"
            type="text"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <label for="introduction" class="label">자기소개</label>
        <div class="control">
          <textarea
            id="introduction"
            v-model="profile.introduction"
            class="textarea"
          ></textarea>
        </div>
      </div>
      <input type="submit" hidden />
      <div v-if="referer" class="field is-grouped">
        <p class="control">
          <button class="button is-primary" type="submit">수정</button>
        </p>
        <p class="control">
          <a :href="referer">
            <button class="button" type="button">돌아가기</button>
          </a>
        </p>
      </div>
      <div v-else class="field">
        <div class="field">
          <div class="control">
            <button class="button is-primary" type="submit">수정</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scope>
.avatar-help {
  text-align: center;
}
</style>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import loadingIcon from '~/components/loadingIcon.vue'
import fadeTransition from '~/components/fadeTransition.vue'

export default Vue.extend({
  components: { loadingIcon, fadeTransition },
  middleware: 'isAuthenticated',
  data() {
    return {
      profile: {
        nickname: '',
        introduction: '',
        website: '',
        hasCustomAvatar: false,
        avatarUrl: '',
        ssoUserId: '',
      },
      showChangedNotification: false,
    }
  },
  apollo: {
    profile: {
      query: gql`
        query {
          me {
            avatarUrl
            ssoUserId
            profile {
              introduction
              website
              nickname
              hasCustomAvatar
            }
          }
        }
      `,
      update: (data: any) => {
        data.me.profile.avatarUrl = data.me.avatarUrl
        data.me.profile.ssoUserId = data.me.ssoUserId
        return data.me.profile
      },
    },
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '프로필 수정')
  },
  methods: {
    async doUpdateProfile() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($profile: UserProfileInput!) {
            updateMyProfile(profile: $profile) {
              nickname
            }
          }
        `,
        variables: {
          profile: {
            nickname: this.profile.nickname,
            introduction: this.profile.introduction,
            website: this.profile.website,
          },
        },
      })

      await this.$apollo.queries.profile.refresh()
      this.showChangedNotification = true
      setTimeout(() => {
        this.showChangedNotification = false
      }, 3000)
    },
  },
})
</script>
