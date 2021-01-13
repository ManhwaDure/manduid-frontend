import { Context } from '@nuxt/types'
import gql from 'graphql-tag'

export default function hasPermission(permission: string) {
  return async function ({ app, error, redirect, route }: Context) {
    const hasToken = !!app.$apolloHelpers.getToken()

    if (hasToken) {
      const result = await app.apolloProvider.defaultClient.query({
        query: gql`
          query($permission: String!) {
            me {
              hasPermission(permission: $permission)
            }
          }
        `,
        variables: {
          permission,
        },
      })

      if (!result.data.me.hasPermission) {
        error({
          message: '권한이 없습니다.',
          statusCode: 403,
        })
      }
    } else {
      redirect(302, '/login?redirect=' + encodeURIComponent(route.fullPath))
    }
  }
}
