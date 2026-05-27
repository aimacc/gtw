const axios = require('axios')
const { HttpsProxyAgent } = require('https-proxy-agent')

const proxy = 'http://user:pass@host:port'

const agent = new HttpsProxyAgent(proxy)

async function loginRequest(username, password) {

  const payload = new URLSearchParams({
    username,
    password
  })

  const { data } = await axios({
    method: 'POST',
    url: 'https://app.orderkuota.com/api/v2/login',
    data: payload.toString(),

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'okhttp/4.12.0'
    },

    httpsAgent: agent
  })

  return data
}

module.exports = {
  loginRequest
}
