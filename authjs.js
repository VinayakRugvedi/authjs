let authConfig
try {
  authConfig = require('../../../authConfig')
  let internalErrorCode = {
    one: 1,
    two: 2,
    three: 3,
    four: 4
  }

  if (authConfig.dataBaseConfiguration === undefined) throw internalErrorCode.one
  if (authConfig.dataBaseConfiguration.dataBase === undefined ||
      authConfig.dataBaseConfiguration.dataBase.length === 0) throw internalErrorCode.two
  if (authConfig.dataBaseConfiguration.connectionString === undefined ||
      authConfig.dataBaseConfiguration.connectionString.length === 0) throw internalErrorCode.three
  if (authConfig.dataBaseConfiguration.dataBase !== 'postgresql' &&
      authConfig.dataBaseConfiguration.dataBase !== 'mongodb') throw internalErrorCode.four
} catch (error) {
  if (error === 1) {
    throw new ReferenceError(
      `
        **********************************************************************************
        You haven't provided the 'dataBaseConfiguration' in the 'authConfig' file!
        Complete the 'authConfig' file with all the desired configurations...
        For more detailed information, navigate to :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        **********************************************************************************
      `)
  }

  if (error === 2) {
    throw new Error(
      `
        **********************************************************************************
        You haven't provided the 'dataBase' field in the 'dataBaseConfiguration'
        of the 'authConfig' file!
        Complete the 'authConfig' file with all the desired configurations...
        For more detailed information, navigate to :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        **********************************************************************************
      `)
  }

  if (error === 3) {
    throw new Error(
      `
        **********************************************************************************
        You haven't provided the 'connectionString' field in the 'dataBaseConfiguration'
        of the 'authConfig' file!
        Complete the 'authConfig' file with all the desired configurations...
        For more detailed information, navigate to :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        **********************************************************************************
      `)
  }

  if (error === 4) {
    throw new Error(
      `
        *******************************************************************************
        As of now, the 'dataBase' field of 'dataBaseConfiguration' can have either of
        the two values : 'postgresql' or 'mongodb'

        ${authConfig.dataBaseConfiguration.dataBase} is not a valid value...
        *******************************************************************************
      `)
  }

  if (error.code === 'MODULE_NOT_FOUND') {
    throw new Error(
      `
        **********************************************************************************
        Cannot find the 'authConfig' file!
        Please place the 'authConfig' file with the desired configurations
        in the same directory as of your node modules...
        For more detailed information, navigate to :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        **********************************************************************************
      `)
  }
  throw error
}

const signUpVerification = require('./controllers/signUpVerification')

let resendOtp, resendVerificationLink
if (authConfig.mailConfiguration === undefined) {
  resendOtp = require('./controllers/resendOtp')
} else {
  resendVerificationLink = require('./controllers/resendVerificationLink')
  if (authConfig.smsConfiguration !== undefined) { resendOtp = require('./controllers/resendOtp') }
}

const updateVerifiedStatus = require('./controllers/updateVerifiedStatus')
const authenticateUser = require('./controllers/authenticateUser')
const changePassword = require('./controllers/changePassword')

const authjs = {
  signUp: signUpVerification, // Arguments : (email or phone number), password
  verify: updateVerifiedStatus, // Arguments : token or (phoneNumber, otp)
  signIn: authenticateUser, // Arguments : (email or phone number), password
  changePassword // Arguments : (email or phone number), newPassword
}

if (resendVerificationLink === undefined) authjs.resendOtp = resendOtp // Arguments : Phone Number
else {
  authjs.resendVerificationLink = resendVerificationLink // Arguments : email
  if (resendOtp !== undefined) authjs.resendOtp = resendOtp
}

module.exports = authjs
