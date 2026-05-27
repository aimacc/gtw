 const axios = require('axios')

const API_URL = 'https://app.orderkuota.com:443/api/v2'

const headers = {
  Host: 'app.orderkuota.com',
  'User-Agent': 'okhttp/4.12.0',
  'Content-Type': 'application/x-www-form-urlencoded'
}

const APP_VERSION_NAME = '25.08.11'
const APP_VERSION_CODE = '250811'
const APP_REG_ID = 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ'

async function loginRequest(username, password) {

  const payload = new URLSearchParams({
    username,
    password,
    app_reg_id: APP_REG_ID,
    app_version_code: APP_VERSION_CODE,
    app_version_name: APP_VERSION_NAME
  })

  const { data } = await axios.post(`${API_URL}/login`, payload, {
    headers
  })

  return data
}

module.exports = {
  loginRequest
}
