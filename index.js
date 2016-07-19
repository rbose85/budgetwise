import Bell from 'bell'
import Hapi from 'hapi'

// Create a server with a host and port
const server = new Hapi.Server({
  debug: { request: ['error'] }
})

server.connection({ host: 'localhost', port: 8000 })

server.register(Bell, (err) => {
  if (err) {
    console.log(`err: ${err}`) // eslint-disable-line no-console
    process.exit(1)
  }

  const URL = 'https://secure.splitwise.com'
  const API = `${URL}/api/v3.0`
  server.auth.strategy('something', 'bell', {
    provider: {
      protocol: 'oauth',
      signatureMethod: 'HMAC-SHA1',
      temporary: `${API}/get_request_token`,
      auth: `${URL}/authorize`,
      token: `${API}/get_access_token`,
      version: '1.0',
      headers: {},
      profile: (credentials, params, _get, cb) => {
        console.log(`credentials: ${credentials}`) // eslint-disable-line no-console
        console.log(`params: ${params}`) // eslint-disable-line no-console

        _get(`${API}/get_current_user`, { format: 'json' }, (profile) => {
          console.log(`profile: ${profile}`) // eslint-disable-line no-console

          return cb()
        })
      }
    },
    password: process.env.SPLITWISE_ENCRYPTION_PASSWORD,
    clientId: process.env.BUDGETWISE_CONSUMER_KEY,
    clientSecret: process.env.BUDGETWISE_CONSUMER_SECRET,
    forceHttps: true,
    isSecure: true
  })

  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    config: {
      auth: 'something',
      handler: (req, reply) => {
        if (!req.auth.isAuthenticated) {
          const error = `!isAuthenticated ... ${JSON.stringify(req.auth)}`
          console.log(error) // eslint-disable-line no-console
          return reply(`Authentication failed: ${req.auth.error.message}`)
        }
        const msg = `isAuthenticated ... ${JSON.stringify(req.auth)}`
        console.log(msg) // eslint-disable-line no-console
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
