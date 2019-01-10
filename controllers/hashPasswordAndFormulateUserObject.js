const cryptoRandomString = require('crypto-random-string')
const otpLib = require('otplib')
const bcrypt = require('bcrypt')

async function hashPasswordAndFormulateUserObject (userName, password, flag) {
  const token = cryptoRandomString(32)
  const date = new Date()
  const userData = {
    token,
    verified: false
  }
  if (!flag) {
    userData.email = userName
    userData.expires = date.setUTCHours(date.getUTCHours() + 2) // Future time in ms from Jan 1, 1970
  } else {
    userData.otp = otpLib.authenticator.generate(token)
    userData.phoneNumber = userName
    userData.expires = date.setUTCMinutes(date.getUTCMinutes() + 5) // Future time in ms from Jan 1, 1970
  }

  const hash =
    await bcrypt.hash(password, 10)
      .catch(error => { throw error })

  console.log(hash, 'Hash of the password')
  userData.password = hash
  return userData
}

module.exports = hashPasswordAndFormulateUserObject
