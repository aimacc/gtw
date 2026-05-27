import express from 'express'
import { loginRequest } from '../../lib/orderkuota.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { username, password } = req.query

    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: 'username & password required'
      })
    }

    const result = await loginRequest(username, password)

    res.json(result)
  } catch (e) {
    res.status(500).json({
      status: false,
      error: e.message
    })
  }
})

export default router
