const Twilio = require('twilio')

const authConfig = require('../../../../../authConfig')
const accountSid = authConfig.smsConfiguration.accountSid
const authToken = authConfig.smsConfiguration.authToken

const twilio = new Twilio(accountSid, authToken)

async function sendOtp (phone, otp) {
  let organizationName = 'TESTING'
  if (authConfig.smsConfiguration.organizationName !== undefined &&
      authConfig.smsConfiguration.organizationName.length !== 0) {
    organizationName = authConfig.smsConfiguration.organizationName
  }

  const from = authConfig.smsConfiguration.from
  // [+][country code][phone number including area code]sms
  const responseData =
    await twilio.messages.create({
      from, // Should be a valid phone number, shortcode, or alphanumeric sender ID
      to: phone,
      body: `Hello, your OTP is : ${otp} - ${organizationName}`
    })
      .catch((error) => { throw error })

  return {
    twilioResponse: responseData,
    authCode: 3,
    authMessage: `The user data is securely stored and the OTP has been sent to ${phone}`
  }
}

module.exports = sendOtp
