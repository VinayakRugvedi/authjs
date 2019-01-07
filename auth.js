const performValidations = require('./controllers/validateEmailAndPassword')
const signUpVerification = require('./controllers/signUpVerification')
const resendVerificationLink = require('./controllers/resendVerificationLink')
const resendOtp = require('./controllers/resendOtp')
const updateVerifiedStatus = require('./controllers/updateVerifiedStatus')
const authenticateUser = require('./controllers/authenticateUser')
const changePassword = require('./controllers/changePassword')

const auth = {
  performValidations, // Arguments : userName, password, confirmPassword
  signUpVerification, // Arguments : userName, password, [flag](true for phoneNumber)
  resendVerificationLink, // Arguments : email
  resendOtp, // Arguments : Phone Number
  updateVerifiedStatus, // Arguments : token or (phoneNumber and otp)
  authenticateUser, // Arguments : email and password
  changePassword // Arguments : email and newPassword
}

module.exports = auth
