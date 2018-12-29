const performValidations = require('./controllers/validateEmailAndPassword')
const signUpVerification = require('./controllers/signUpVerification')
const resendVerificationLink = require('./controllers/resendVerificationLink')
const updateVerifiedStatus = require('./controllers/updateVerifiedStatus')
const authenticateUser = require('./controllers/authenticateUser')
const changePassword = require('./controllers/changePassword')

const auth = {
  performValidations, //Arguments : email, password, confirmPassword
  signUpVerification, //Arguments : email and password
  resendVerificationLink, //Arguments : email
  updateVerifiedStatus, //Arguments : token
  authenticateUser, //Arguments : email and password
  changePassword, //Arguments : email and new password
}

module.exports = auth
