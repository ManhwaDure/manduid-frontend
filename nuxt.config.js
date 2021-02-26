const modules = ['@nuxtjs/bulma', '@nuxtjs/apollo']
if (
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() !== 'production'
)
  modules.push([
    '@nuxtjs/proxy',
    {
      pathRewrite: {
        '^/api': '/',
        '^/graphql': '/',
        '^/.well-known/openid-configuration': '/openid-configuration',
      },
    },
  ])

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: '만화두레',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    '@nuxtjs/fontawesome',
  ],

  router: {
    middleware: 'validateAuthToken',
  },

  modules,

  proxy: {
    '/graphql': 'http://127.0.0.1:4000',
    '/.well-known': 'http://127.0.0.1:4001',
    '/api': 'http://127.0.0.1:4001',
  },

  fontawesome: {
    icons: {
      solid: ['faCircleNotch'],
    },
  },

  apollo: {
    clientConfigs: {
      default: '~/apollo.config.js',
    },
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network',
      },
    },
    authenticationType: 'GqlAuth',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
  },

  server: {
    host: '0.0.0.0',
  },
}
