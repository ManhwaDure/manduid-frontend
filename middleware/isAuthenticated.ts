import { Context } from '@nuxt/types'

export default function ({ app, error }: Context) {
  const hasToken = !!app.$apolloHelpers.getToken()

  if (!hasToken) {
    error({
      statusCode: 503,
      message: '인증이 필요합니다.',
    })
  }
}
