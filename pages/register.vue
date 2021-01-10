<template>
  <div>
    <template v-if="isMembershipCheck">
      <p>
        동아리 회원만 사이트에 회원가입할 수 있습니다.<br />
        만약 동아리 회원이 아니시라면 <a href="//apply.caumd.club">여기</a>서
        입부신청하세요.<br />
        회원임에도 오류가 발생한다면 회장단에게 문의해주시기 바랍니다.
      </p>
      <form>
        <div class="field">
          <label for="name" class="label">이름</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="name"
              placeholder="예시 : 김만두"
              required
            />
          </div>
        </div>
        <div class="field">
          <label for="studentId" class="label">학번</label>
          <div class="control">
            <input
              type="number"
              class="input"
              name="studentId"
              placeholder="예시 : 19871234"
              required
            />
            <p class="help">학생증에 적힌 학번 8자리를 적어주세요.</p>
          </div>
        </div>
        <div class="field">
          <label for="phoneNumber" class="label">전화번호</label>
          <div class="control">
            <input
              type="tel"
              class="input"
              placeholder="예시: 010-0000-0000"
              pattern="[0-9]{2,4}-[0-9]{3,5}-[0-9]{3,5}"
              required
            />
            <p class="help">
              하이픈(-)은 자동으로 입력됩니다. 숫자만 입력해주세요.
            </p>
          </div>
        </div>
        <input type="submit" hidden />
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button goBack">뒤로 가기</button>
          </div>
          <div class="control">
            <button class="button is-primary" type="submit">회원확인</button>
          </div>
        </div>
      </form>
    </template>
    <template v-else-if="isAccountCreation">
      <p>사용하실 아이디와 비밀번호, 그리고 이메일 주소를 입력해주세요.</p>
      <form action="">
        <div class="field">
          <label for="id" class="label">아이디</label>
          <div class="control">
            <input
              type="text"
              class="input"
              placeholder="아이디"
              pattern="[0-9a-zA-Z_]+"
              minlength="5"
              maxlength="30"
              required
            />
            <p class="help">
              아이디는 최소 5글자에서 최대 30글자까지 가능하며, 숫자와 영문
              대소문자, 언더스코어(_)만 이용하실 수 있습니다.
            </p>
          </div>
        </div>
        <div class="field">
          <label for="password" class="label">비밀번호</label>
          <div class="control">
            <input
              type="password"
              class="input"
              minlength="5"
              placeholder="최소 5자리 이상"
              required
            />
            <p class="help">비밀번호는 최소 5자리 이상이어야 합니다.</p>
          </div>
        </div>
        <div class="field">
          <label for="password_retype" class="label">비밀번호 재확인</label>
          <div class="control">
            <input
              type="password"
              class="input"
              name="password_retype"
              minlength="5"
              required
            />
          </div>
        </div>
        <div class="field">
          <label for="emailAddress" class="label">이메일 주소</label>
          <input
            v-if="allowCauMailOnly"
            type="email"
            class="input"
            placeholder="예시 : example@cau.ac.kr"
            pattern=".+@cau.ac.kr"
            required
          />
          <input
            v-else
            type="email"
            class="input"
            placeholder="예시 : example@example.com"
            required
          />
          <p v-if="allowCauMailOnly" class="help">
            학교 이메일(@cau.ac.kr)만 사용 가능합니다.
          </p>
        </div>
        <input type="submit" hidden />
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button goBack">뒤로가기</button>
          </div>
          <div class="control">
            <button class="button is-primary" type="submit">회원가입</button>
          </div>
        </div>
      </form>
    </template>
    <template v-else-if="isEmailSent">
      <p class="subtitle">거의 다 됐습니다!</p>
      <p>
        인증 이메일을 전송했습니다. 이메일을 확인해주세요. <br />만약 이메일이
        보이지 않는다면, 스팸메일함도 확인해주시기 바랍니다.
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    isMembershipCheck() {
      return true
    },
  },
  created() {
    this.$store.commit('SET_RIGHT_CARD_LAYOUT_TITLE', '회원가입')
  },
})
</script>
