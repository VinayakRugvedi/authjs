const Nexmo = require('nexmo')

const config = require('../../config')
const apiKey = config.smsConfiguration.apiKey
const apiSecret = config.smsConfiguration.apiSecret

const nexmo = new Nexmo({
  apiKey,
  apiSecret
})

async function sendOtp (phoneNumber, otp) {
  const text = `Hello, your OTP is : ${otp}`
  const from = config.smsConfiguration.from

  function sendSms () {
    return new Promise((resolve, reject) => {
      nexmo.message.sendSms(from, phoneNumber, text,
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
    message: `The user data is securely stored and the OTP has been sent to ${phoneNumber}`
  }
}

module.exports = sendOtp
