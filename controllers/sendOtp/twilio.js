const Twilio = require('twilio')

const config = require('../../config')
const accountSid = config.smsConfiguration.accountSid
const authToken = config.smsConfiguration.authToken

const twilio = new Twilio(accountSid, authToken)

async function sendOtp (phoneNumber, otp) {
  const from = config.smsConfiguration.from
  // [+][country code][phone number including area code]
  const responseData =
    await twilio.messages.create({
      from: from, // Should be a valid phone number, shortcode, or alphanumeric sender ID
      to: phoneNumber,
      body: `Hello, OTP : ${otp}`
    })
      .catch((error) => { throw error })

  return {
    twilioResponse: responseData,
    message: `The user data is securely stored and the OTP has been sent to ${phoneNumber}`
  }
}

module.exports = sendOtp
