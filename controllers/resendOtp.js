const otpLib = require('otplib')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const sendOtp = require(`./sendOtp/${config.smsConfiguration.sender}`)

async function resendOtp (phoneNumber) {
  const userData =
    await dataBase.fetch('phonenumber', phoneNumber)
      .catch(error => { throw error })

  if (Object.keys(userData).length === 0)
    return {
      authCode: 13,
      authMessage: `The user : ${phoneNumber} has not yet registered!`
    }
  else {
    if (userData.verified === true)
      return {
        authCode: 15,
        authMessage: `The user : ${phoneNumber} has already been verified!`
      }

    const otp = otpLib.authenticator.generate(userData.token)
    const date = new Date()
    const expires = date.setUTCMinutes(date.getUTCMinutes() + 5)

    await dataBase.updateOtpAndExpires(userData._id, otp, expires)
      .catch(error => { throw error })

    const returnObject =
      await sendOtp(userData.phonenumber, otp)
        .catch(error => { throw error })

    returnObject.authMessage = `The OTP has been resent to : ${phoneNumber}`
    return returnObject
  }
}

module.exports = resendOtp
