<template>
  <div>
    <fade-transition>
      <div
        v-for="message in messages"
        :key="message.createdAt.getTime()"
        class="notification"
        :class="{
          'is-success': message.type === 'success',
          'is-danger': message.type === 'danger',
        }"
      >
        {{ message.message }}
      </div></fade-transition
    >
    <form
      v-if="registerationStep === 'MembershipCheck'"
      @submit.prevent="checkMembership"
    >
      <p>
        동아리 회원만 사이트에 회원가입할 수 있습니다. <br />
        만약 동아리 회원이 아니시라면 <nuxt-link to="/apply">여기</nuxt-link>서
        입부신청해주세요. <br />
        회원임에도 오류가 발생한다면 회장단에게 문의해주시기 바랍니다.
      </p>
      <div class="field">
        <label for="name" class="label">이름</label>
        <div class="control">
          <input
            id="name"
            v-model="name"
            type="text"
            class="input"
            placeholder="예시 : 김만두"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="studentId" class="label">학번</label>
        <div class="control">
          <input
            id="studentId"
            v-model.number="studentId"
            type="number"
            class="input"
            placeholder="예시: 19871234"
            required
          />
          <p class="help">
            "너 몇학번이니?"할 때 학번이 아니라 "시험지에 이름과 학번을
            적어주세요." 할 때의 학번입니다.
          </p>
        </div>
      </div>
      <div class="field">
        <label for="phoneNumber" class="label">전화번호</label>
        <div class="control">
          <tel-input
            id="phoneNumber"
            v-model="phoneNumber"
            class="input"
            placeholder="예시: 010-0000-0000"
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
          <a href="#" class="button" @click.prevent="$router.go(-1)"
            >뒤로 가기</a
          >
        </div>
        <div class="control">
          <button class="button is-primary" type="submit">회원확인</button>
        </div>
      </div>
    </form>
    <form
      v-else-if="registerationStep === 'EnterIdInformation'"
      @submit.prevent="createId"
    >
      <div class="field">
        <label for="id" class="label">아이디</label>
        <div class="control">
          <input
            id="id"
            v-model="id"
            type="text"
            class="input"
            placeholder="아이디"
            pattern="[0-9a-zA-Z_]+"
            minlength="5"
            maxlength="30"
            required
          />
        </div>
        <p class="help">
          아이디는 최소 5글자에서 최대 30글자까지 가능하며, 숫자와 영문
          대소문자, 언더스코어(_)만 이용하실 수 있습니다.
        </p>
      </div>
      <div class="field">
        <label for="password" class="label">비밀번호</label>
        <div class="control">
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            minlength="5"
            placeholder="최소 5자리 이상"
            required
          />
        </div>
        <p class="help">
          비밀번호는 최소 5자리 이상이여야 하며, 그 외 짜증나는 규칙은 없습니다.
        </p>
      </div>
      <div class="field">
        <label for="password_retype" class="label">비밀번호 재확인</label>
        <div class="control">
          <input
            id="password_retype"
            v-model="passwordRetype"
            type="password"
            class="input"
          />
        </div>
      </div>
      <div class="field">
        <label for="emailAddress" class="label">이메일주소</label>
        <div class="control">
          <input
            id="emailAddress"
            v-model="email"
            type="email"
            class="input"
            placeholder="예시: example@cau.ac.kr"
            pattern=".+@cau.ac.kr"
            required
          />
        </div>
        <p class="help">학교 이메일(@cau.ac.kr)만 사용 가능합니다.</p>
      </div>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <a
            class="button"
            href="#"
            :disabled="sendingMail"
            @click.prevent="
              () => {
                RegisterationStep = 'MembersihpCheck'
              }
            "
            >뒤로 가기</a
          >
        </div>
        <div class="control">
          <button
            class="button is-primary"
            type="submit"
            :disabled="sendingMail"
          >
            회원가입
          </button>
        </div>
      </div>
    </form>
    <p v-else>
      인증 이메일을 전송했습니다. 이메일을 확인해주세요. <br />
      이메일이 오지 않았다면, 스팸메일함을 확인해주시기 바랍니다.<br />
      <br />
      만약 15분이 지난 후에도 이메일이 오지 않는 다면
      <a href="#" @click.prevent="resendEmail">여기</a>를 눌러주세요.
    </p>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import TelInput from '~/components/telInput.vue'
import FadeTransition from '~/components/fadeTransition.vue'

type RegisterStep =
  | 'MembersihpCheck'
  | 'EnterIdInformation'
  | 'VerificationEmailSent'

type VueDataType = {
  registerationStep: RegisterStep
  studentId: number
  phoneNumber: string
  name: string
  id: string
  password: string
  passwordRetype: string
  email: string
  membershipToken: string
  resendToken: string
  sendingMail: boolean
  messages: {
    type: 'success' | 'danger'
    message: string
    createdAt: Date
  }[]
}

export default Vue.extend({
  components: { TelInput, FadeTransition },
  data(): VueDataType {
    return {
      registerationStep: 'MembershipCheck' as RegisterStep,
      studentId: 0,
      phoneNumber: '',
      name: '',
      id: '',
      password: '',
      passwordRetype: '',
      email: '',
      membershipToken: '',
      sendingMail: false,
      resendToken: '',
      messages: [],
    }
  },
  methods: {
    showMessage(type: 'success' | 'danger', message: string): void {
      this.messages.push({
        type,
        message,
        createdAt: new Date(),
      })
      setTimeout(() => {
        this.messages.shift()
      }, 5000)
    },
    async checkMembership(): Promise<void> {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $studentId: Int!
            $phoneNumber: TelephoneNumber!
            $name: String!
          ) {
            signUp_verifyMembership(
              studentId: $studentId
              phoneNumber: $phoneNumber
              name: $name
            )
          }
        `,
        variables: {
          phoneNumber: this.phoneNumber,
          studentId: this.studentId,
          name: this.name,
        },
      })

      if (result.data.signUp_verifyMembership !== null) {
        this.membershipToken = result.data.signUp_verifyMembership
        this.registerationStep = 'EnterIdInformation'
      } else {
        this.showMessage(
          'danger',
          '회원 확인에 실패했습니다. 동아리에 가입하시려는 거라면 https://apply.caumd.club 에서 신청해주세요!'
        )
        this.phoneNumber = ''
        this.studentId = 0
        this.name = ''
      }
    },
    async createId(): Promise<void> {
      if (this.password !== this.passwordRetype) {
        return alert('비밀번호와 비밀번호 재확인이 서로 일치하지 않습니다.')
      }

      this.sendingMail = true
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $token: String!
            $id: String!
            $email: String!
            $password: String!
          ) {
            signUp_createId(
              membershipVerificationToken: $token
              id: $id
              emailAddress: $email
              password: $password
            )
          }
        `,
        variables: {
          token: this.membershipToken,
          id: this.id,
          email: this.email,
          password: this.password,
        },
      })
      this.sendingMail = false

      this.resendToken = result.data.signUp_createId
      this.registerationStep = 'VerificationEmailSent'
    },
    async resendEmail(): Promise<void> {
      if (this.sendingMail) return
      this.sendingMail = true
      await this.$apollo.mutate({
        mutation: gql`
          mutation($token: String!) {
            resendVerificationEmail(token: $token)
          }
        `,
        variables: {
          token: this.resendToken,
        },
      })
      this.sendingMail = false

      this.showMessage('success', '인증 메일을 다시 보냈습니다!')
    },
  },
})
</script>
