import { Context } from '@nuxt/types'
import gql from 'graphql-tag'

export default async function ({ app, error, redirect, route }: Context) {
  const hasToken = !!app.$apolloHelpers.getToken()

  if (hasToken) {
    const result = await app.apolloProvider.defaultClient.query({
      query: gql`
        query {
          me {
            isExecutive
            isPresident
          }
        }
      `,
    })

    if (!result.data.me.isExecutive && !result.data.me.isPresident) {
      error({
        message: '집행부원이나 회장만이 접근할 수 있습니다.',
        statusCode: 403,
      })
    }
  } else {
    redirect(302, '/login?redirect=' + encodeURIComponent(route.fullPath))
  }
}
