const Twilio = require('twilio')

const config = require('../../config')
const accountSid = config.smsConfiguration.accountSid
const authToken = config.smsConfiguration.authToken

const twilio = new Twilio(accountSid, authToken)

function sendOtp (from, phoneNumber, otp) {
  // [+][country code][phone number including area code]
  twilio.messages.create({
    from: from, // Should be a valid phone number, shortcode, or alphanumeric sender ID
    to: phoneNumber,
    body: `Hello, OTP : ${otp}`
  })
    .then((responseData) => {
      console.log(responseData, 'Twilio : Successfully sent the OTP')
      console.log('The OTP has been sent!')
    })
    .catch((error) => {
      console.log(error, 'Twilio : Error')
      console.log('Coudnt send the OTP!')
    })
}

module.exports = sendOtp
