const axios = require('axios')
const { HttpsProxyAgent } = require('https-proxy-agent')

const proxy = 'http://user:pass@host:port'

const agent = new HttpsProxyAgent(proxy)

async function loginRequest(username, password) {

  const payload = new URLSearchParams({
    username,
    password
  })

  try {

    const { data } = await axios.post(
      'https://app.orderkuota.com/api/v2/login',
      payload.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'okhttp/4.12.0'
        },
        httpsAgent: agent
      }
    )

    return data

  } catch (e) {

    return {
      status: false,
      error: e.message,
      response: e.response?.data || null
    }

  }

}

module.exports = {
  loginRequest
}
