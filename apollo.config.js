export default (_context) => {
  return {
    httpEndpoint:
      (process.env.NODE_ENV &&
      process.env.NODE_ENV.trim().toLowerCase() === 'production'
        ? 'https://id.caumd.club'
        : 'http://localhost:3000') + '/graphql',
  }
}
