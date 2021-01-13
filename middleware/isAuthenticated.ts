import { Context } from '@nuxt/types'

export default function ({ app, redirect, route }: Context) {
  const hasToken = !!app.$apolloHelpers.getToken()

  if (!hasToken) {
    redirect(302, '/login?redirect=' + encodeURIComponent(route.fullPath))
  }
}
