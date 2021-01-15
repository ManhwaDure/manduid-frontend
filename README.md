# manduid-frontend

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Proxy
In production, you have to proxy `/graphql` to graphql api and `/api` to http api. and also you have to proxy `/.well-known/openid-configuration` properly.
If you're running in development mode (which means `NODE_ENV` is not `production`), application will automatically proxy `/graphql` to 4000 port and `/api` to 4001 port, with proper proxying of `/.well-known/openid-configuration`

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
