try {
  const authConfig = require('./config')
  if(authConfig.dataBaseConfiguration === undefined) throw 1
  if(authConfig.dataBaseConfiguration.dataBase === undefined ||
      authConfig.dataBaseConfiguration.dataBase.length === 0) throw 2
  if(authConfig.dataBaseConfiguration.connectionString === undefined ||
      authConfig.dataBaseConfiguration.connectionString.length === 0) throw 3
} catch(error) {
  if(error === 1) {
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

  if(error === 2) {
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

  if(error === 3) {
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

  if(error.code === 'MODULE_NOT_FOUND') {
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
const resendVerificationLink = require('./controllers/resendVerificationLink')
const resendOtp = require('./controllers/resendOtp')
const updateVerifiedStatus = require('./controllers/updateVerifiedStatus')
const authenticateUser = require('./controllers/authenticateUser')
const changePassword = require('./controllers/changePassword')

const authjs = {
  signUp: signUpVerification, // Arguments : (email or phone number), password
  resendVerificationLink, // Arguments : email
  resendOtp, // Arguments : Phone Number
  verify: updateVerifiedStatus, // Arguments : token or (phoneNumber, otp)
  signIn: authenticateUser, // Arguments : (email or phone number), password
  changePassword // Arguments : (email or phone number), newPassword
}

module.exports = authjs
