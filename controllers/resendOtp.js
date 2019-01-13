const otpLib = require('otplib')

const authConfig = require('../../../../authConfig')
const dataBase = require(`../model/${authConfig.dataBaseConfiguration.dataBase}`)
const sendOtp = require(`./sendOtp/${authConfig.smsConfiguration.sender}`)

async function resendOtp (phone) {
  const userData =
    await dataBase.fetch('phone', phone)
      .catch(error => { throw error })

  if (Object.keys(userData).length === 0)
    return {
      authCode: 13,
      authMessage: `The user : ${phone} has not yet registered!`
    }
  else {
    if (userData.verified === true)
      return {
        authCode: 15,
        authMessage: `The user : ${phone} has already been verified!`
      }

    const otp = otpLib.authenticator.generate(userData.token)
    const date = new Date()
    const expires = date.setUTCMinutes(date.getUTCMinutes() + 5)

    await dataBase.updateOtpAndExpires(userData._id, otp, expires)
      .catch(error => { throw error })

    const returnObject =
      await sendOtp(userData.phone, otp)
        .catch(error => { throw error })

    returnObject.authMessage = `The OTP has been resent to : ${phone}`
    return returnObject
  }
}

module.exports = resendOtp
