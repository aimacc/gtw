const { loginRequest } = require('../../lib/orderkuota')

module.exports = (app) => {

  app.get('/api/orderkuota/login', async (req, res) => {
    try {
      const { username, password } = req.query

      if (!username || !password) {
        return res.status(400).json({
          status: false,
          message: 'username & password required'
        })
      }

      const result = await loginRequest(username, password)

      res.json({
        status: true,
        result
      })

    } catch (e) {
      res.status(500).json({
        status: false,
        error: e.message
      })
    }
  })

}
