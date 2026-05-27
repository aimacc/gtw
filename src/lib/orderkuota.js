 const axios = require('axios')

const API_URL = 'https://app.orderkuota.com:443/api/v2'

const APP_VERSION_NAME = '25.08.11'
const APP_VERSION_CODE = '250811'

const headers = {
  Host: 'app.orderkuota.com',
  Connection: 'Keep-Alive',
  Accept: 'application/json',
  'Accept-Encoding': 'gzip',
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent': 'okhttp/4.12.0'
}

async function loginRequest(username, password) {

  const payload = new URLSearchParams({
    username,
    password,
    app_reg_id: 'di309HvATsaiCppl5eDpoc',
    app_version_code: APP_VERSION_CODE,
    app_version_name: APP_VERSION_NAME,
    phone_model: 'SM-G960N',
    phone_android_version: '9',
    ui_mode: 'light',
    request_time: Math.floor(Date.now() / 1000)
  })

  try {

    const { data } = await axios({
      method: 'POST',
      url: `${API_URL}/login`,
      headers,
      data: payload.toString()
    })

    return data

  } catch (err) {

    if (err.response) {
      return {
        status: false,
        code: err.response.status,
        data: err.response.data
      }
    }

    return {
      status: false,
      error: err.message
    }
  }

}

module.exports = {
  loginRequest
}
