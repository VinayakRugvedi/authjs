const Nexmo = require('nexmo')

const config = require('../../config')
const apiKey = config.smsConfiguration.apiKey
const apiSecret = config.smsConfiguration.apiSecret

const nexmo = new Nexmo({
  apiKey,
  apiSecret
})

function sendOtp (from, phoneNumber, otp) {
  const text = `Hello, OTP : ${otp}`

  nexmo.message.sendSms(from, phoneNumber, text,
    (error, responseData) => {
      if (error) {
        console.log(error, 'Nexmo : Error')
        console.log('Coudnt send the OTP!')
      } else {
        console.log(responseData, 'Nexmo : Successfully sent the OTP')
        console.log('The OTP has been sent!')
      }
    })
}

module.exports = sendOtp
