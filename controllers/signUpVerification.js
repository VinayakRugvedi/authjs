const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const hashPasswordAndFormulateUserObject = require('./hashPasswordAndFormulateUserObject')
const sendVerificationLink = require(`./sendVerificationLink/${config.mailConfiguration.mailer}`)
const sendOtp = require(`./sendOtp/${config.smsConfiguration.sender}`)

async function signUpVerification (userName, password, flag = false) {
  const userStatus =
    await isUserRegistered(userName, password, flag)
      .catch(error => { throw error })

  if (userStatus.isRegistered === false) {
    const userData =
      await hashPasswordAndFormulateUserObject(userName, password, flag)
        .catch(error => { throw error })
    const returnObject =
      await storeUserDataAndSendVerification(userData, flag)
        .catch(error => { throw error })
    return returnObject
  } else if (userStatus.isRegistered === true)
    return {
      message: userStatus.message
    }
}

async function isUserRegistered (userName, password, flag) {
  const fetchResult =
    await dataBase.fetch(flag ? 'phonenumber' : 'email', userName)
      .catch(error => { throw error })
  if (Object.keys(fetchResult).length === 0)
    return {
      isRegistered: false
    }
  else {
    if (!fetchResult.verified)
      return { // User registered but not verified
        isRegistered: true,
        message: `The user : ${userName} has already registered but not verified!`
      }
    else
      return {
        isRegistered: true,
        message: `The user : ${userName} has been registered and verified - User can now Sign In with his/her credentials`
      }
  }
}

async function storeUserDataAndSendVerification (userData, flag) {
  await dataBase.insert(userData, flag)
    .catch(error => { throw error })

  let returnObject
  if (!flag) {
    returnObject =
      await sendVerificationLink(userData.email, userData.token)
        .catch(error => { throw error })
  } else {
    returnObject =
      await sendOtp(userData.phoneNumber, userData.otp)
        .catch(error => { throw error })
  }
  return returnObject
}

module.exports = signUpVerification
