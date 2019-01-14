const validator = require('validator')

const authConfig = require('../../../../authConfig')
const dataBase = require(`../model/${authConfig.dataBaseConfiguration.dataBase}`)
const hashPasswordAndFormulateUserObject = require('./hashPasswordAndFormulateUserObject')

let sendVerificationLink, sendOtp
if (authConfig.mailConfiguration === undefined) {
  if (authConfig.smsConfiguration === undefined) {
    throw new Error(
      `
        ********************************************************************************
        You have neither set the 'mailConfiguration' object nor the 'smsConfiguration'
        object in your 'authConfig' file
        You have to atleast set/configure one of them in order to initiate the verification process
        i.e to either send a verification link(if the user-name is an email address)
        or send an OTP(if the user-name is a phone number)

        For more detailed information regarding the 'authConfig' file,
        navigate to :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        ********************************************************************************
      `)
  } else
      sendOtp = require(`./sendOtp/${authConfig.smsConfiguration.sender}`)
} else {
    sendVerificationLink = require(`./sendVerificationLink/${authConfig.mailConfiguration.mailer}`)
    if (authConfig.smsConfiguration !== undefined)
      sendOtp = require(`./sendOtp/${authConfig.smsConfiguration.sender}`)
}

async function signUpVerification (userName, password) {
  let isPhone = false
  if (!validator.isEmail(userName)) {
    if (validator.isMobilePhone(userName, 'any', { strictMode: true }) &&
        authConfig.smsConfiguration !== undefined) isPhone = true
    else {
      throw new Error(
        `
          *******************************************************************************
          The email/phoneNumber passed to 'signUp' function of auth
          is not in the right format!

          If you are passing a phone number ensure that it doesn't have any special
          characters(except '+') and is in this format only :
                    [+][country code][subscriber number including area code],
          with no special characters!
          *******************************************************************************
        `)
    }
  }

  const userStatus =
    await isUserRegisteredAndVerified(userName, password, isPhone)
      .catch(error => { throw error })

  if (userStatus.isRegistered === false) {
    const userData =
      await hashPasswordAndFormulateUserObject(userName, password, isPhone)
        .catch(error => { throw error })
    const returnObject =
      await storeUserDataAndSendVerification(userData, isPhone)
        .catch(error => { throw error })
    return returnObject
  } else if (userStatus.isRegistered === true)
    return {
      authCode: userStatus.authCode,
      authMessage: userStatus.authMessage
    }
}

async function isUserRegisteredAndVerified (userName, password, isPhone) {
  const fetchResult =
    await dataBase.fetch(isPhone ? 'phone' : 'email', userName)
      .catch(error => { throw error })
  if (Object.keys(fetchResult).length === 0)
    return {
      isRegistered: false
    }
  else {
    if (!fetchResult.verified)
      return { // User registered but not verified
        isRegistered: true,
        authCode: 14,
        authMessage: `The user : ${userName} has already registered but not verified!`
      }
    else
      return {
        isRegistered: true,
        authCode: 15,
        authMessage: `The user : ${userName} has already been registered and verified - User can now Sign In with his/her credentials`
      }
  }
}

async function storeUserDataAndSendVerification (userData, isPhone) {
  await dataBase.insert(userData, isPhone)
    .catch(error => { throw error })

  let returnObject
  if (!isPhone) {
    returnObject =
      await sendVerificationLink(userData.email, userData.token)
        .catch(error => { throw error })
  } else {
    returnObject =
      await sendOtp(userData.phone, userData.otp)
        .catch(error => { throw error })
  }
  return returnObject
}

module.exports = signUpVerification
