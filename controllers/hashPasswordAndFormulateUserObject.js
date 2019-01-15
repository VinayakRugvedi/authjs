const cryptoRandomString = require('crypto-random-string')
const otpLib = require('otplib')
const bcrypt = require('bcryptjs')

async function hashPasswordAndFormulateUserObject (userName, password, isPhone) {
  const token = cryptoRandomString(32)
  const date = new Date()
  const userData = {
    token,
    verified: false
  }
  if (!isPhone) {
    userData.email = userName
    userData.expires = date.setUTCHours(date.getUTCHours() + 12) // Future time in ms from Jan 1, 1970
  } else {
    userData.otp = otpLib.authenticator.generate(token)
    userData.phone = userName
    userData.expires = date.setUTCMinutes(date.getUTCMinutes() + 10) // Future time in ms from Jan 1, 1970
  }

  const hash =
    await bcrypt.hash(password, 10)
      .catch(error => { throw error })

  userData.password = hash
  return userData
}

module.exports = hashPasswordAndFormulateUserObject
