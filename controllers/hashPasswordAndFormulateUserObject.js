const cryptoRandomString = require('crypto-random-string')
const otpLib = require('otplib')
const bcrypt = require('bcrypt')

async function hashPasswordAndFormulateUserObject(userName, password, flag, userData = null) {
  let token = cryptoRandomString(32)
  let date = new Date()
  userData = {
    token,
    verified : false
  }
  if(userData === null && !flag) {
    userData.email = userName
    userData.expires = date.setUTCHours(date.getUTCHours() + 2) // Future time in ms from Jan 1, 1970
  } else {
    userData.otp = otpLib.authenticator.generate(token)
    userData.phoneNumber = userName
    userData.expires = date.setUTCMinutes(date.getUTCMinutes() + 5) // Future time in ms from Jan 1, 1970
  }

  const hash =
    await bcrypt.hash(password, 10)
      .catch((error) => console.log(error))

  if(hash === undefined)
    console.log('Couldnt securely store your password; Try Again...')
    // msg : 'Couldnt securely store your password; Try Again... '
  else {
    console.log(hash)
    userData.password = hash
    return userData
  }
}

module.exports = hashPasswordAndFormulateUserObject
