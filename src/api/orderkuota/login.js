import { loginRequest } from '../../lib/orderkuota.js'

export default async function handler(req, res) {
  try {
    const { username, password } = req.query

    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: 'username & password required'
      })
    }

    const result = await loginRequest(username, password)

    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({
      status: false,
      error: e.message
    })
  }
}
