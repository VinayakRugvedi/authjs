const validator = require('validator')

function performValidations(email, password, confirmPassword) {
    let validationStatus =
    validateEmailAndPassword(email, password, confirmPassword)
    if(typeof validationStatus === 'object')
      console.log(validationStatus)
    else console.log('VALIDATOR : Everything is proper')
}

function validateEmailAndPassword(email, password, confirmPassword) {
  let messageObject = {
    msg : ''
  }

  if(validator.isEmpty(email)) {
    messageObject.msg = "The email field is left empty"
    return messageObject
  }
  if(!validator.isEmail(email)) {
    messageObject.msg = "The email entered is not in the right format"
    return messageObject
  }
  return validatePassword(password, confirmPassword)
}

function validatePassword(password, confirmPassword) {
  let messageObject = {
    msg : ''
  }
  if(validator.isEmpty(password)) {
    messageObject.msg = "The password field is left empty"
    return messageObject
  }
  if(validator.isEmpty(confirmPassword)) {
    messageObject.msg = "The Confirm Password field is left empty"
    return messageObject
  }
  if(!validator.isLength(password, {min:8, max:25}) || !validator.isLength(confirmPassword, {min:8, max:25})) {
    messageObject.msg = "The length of password should be in the range of 8 - 25"
    return messageObject
  }
  if(!validator.equals(password, confirmPassword)) {
    messageObject.msg = "The passwords do not match"
    return messageObject
  }
}

module.exports = performValidations
