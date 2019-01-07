const otpLib = require('otplib')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const sendOtp = require(`./sendOtp/${config.smsConfiguration.sender}`)

async function resendOtp (phoneNumber) {
  let userData = await dataBase.fetch('phonenumber', phoneNumber)
  if (userData === undefined)
    console.log('Oops, something went wrong; Try again later')
  else if (Object.keys(userData).length === 0)
    console.log('There is no account registered with this phoneNumber; Register soon!')
  else {
    let otp = otpLib.authenticator.generate(userData.token) // Will generate same OTP! - 30seconds
    let date = new Date()
    let expires = date.setUTCMinutes(date.getUTCMinutes() + 5)
    let updateResult = await dataBase.updateOtpAndExpires(userData._id, otp, expires)
    if (updateResult === undefined)
      console.log('Oops something went wrong; Try again')
    else {
      let from = config.smsConfiguration.from
      sendOtp(from, userData.phonenumber, otp)
    }
  }
}

module.exports = resendOtp
