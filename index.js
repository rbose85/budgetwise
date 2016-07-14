import Bell from 'bell'
import Hapi from 'hapi'

// Create a server with a host and port
const server = new Hapi.Server({
  debug: { request: ['error'] }
})

server.connection({ host: 'localhost', port: 8000 })

server.register(Bell, (err) => {
  if (err) {
    console.log(err) // eslint-disable-line no-console
    process.exit(1)
  }

  server.auth.strategy('github-oauth', 'bell', {
    provider: 'github',
    password: process.env.COOKIE_ENCRYPTION_PASSWORD,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    isSecure: false
  })

  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    config: {
      auth: 'github-oauth',
      handler: (req, reply) => {
        if (!req.auth.isAuthenticated) {
          return reply(`Authentication failed: ${req.auth.error.message}`)
        }
        return reply.redirect('/home')
      }
    }
  })

  // Start the server
  server.start((e) => {
    if (e) {
      throw e
    }

    console.log('Server running at:', server.info.uri) // eslint-disable-line no-console
  })
})
