import { Context } from '@nuxt/types'
import gql from 'graphql-tag'

export default async function ({ app }: Context) {
  const hasToken = !!app.$apolloHelpers.getToken()

  if (hasToken) {
    const test = await app.apolloProvider.defaultClient.query({
      query: gql`
        query {
          me {
            id
          }
        }
      `,
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    })

    if (test.errors && test.errors.length !== 0) {
      await app.$apolloHelpers.onLogout()
    }
  }
}
