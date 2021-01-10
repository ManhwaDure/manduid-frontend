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

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/bulma', '@nuxtjs/apollo'],

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
}
