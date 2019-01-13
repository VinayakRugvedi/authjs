const Nexmo = require('nexmo')

const authConfig = require('../../../../authConfig')
const apiKey = authConfig.smsConfiguration.apiKey
const apiSecret = authConfig.smsConfiguration.apiSecret

const nexmo = new Nexmo({
  apiKey,
  apiSecret
})

async function sendOtp (phone, otp) {
  let organizationName = 'TESTING'
  if (authConfig.smsConfiguration.organizationName !== undefined &&
      authConfig.smsConfiguration.organizationName.length !== 0) {
    organizationName = authConfig.smsConfiguration.organizationName
  }

  const text = `Hello, your OTP is : ${otp} - ${organizationName}`
  const from = authConfig.smsConfiguration.from

  function sendSms () {
    return new Promise((resolve, reject) => {
      nexmo.authMessage.sendSms(from, phone, text,
        (error, responseData) => {
          if (error) reject(error)
          else resolve(responseData)
        })
    })
  }

  const responseData =
    await sendSms()
      .catch(error => { throw error })

  return {
    nexmoResponse: responseData,
    authCode: 3,
    authMessage: `The user data is securely stored and the OTP has been sent to ${phone}`
  }
}

module.exports = sendOtp
