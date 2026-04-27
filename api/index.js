const serverless = require('serverless-http')

try {
  const app = require('../server')
  module.exports = serverless(app)
} catch (error) {
  console.error('Failed to initialize serverless function:', error)
  module.exports = (req, res) => {
    res.status(500).json({ error: 'Server initialization failed', details: error.message })
  }
}
