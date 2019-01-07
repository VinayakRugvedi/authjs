const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const hashPasswordAndFormulateUserObject = require('./hashPasswordAndFormulateUserObject')
const sendVerificationLink = require(`./sendVerificationLink/${config.mailConfiguration.mailer}`)
const sendOtp = require(`./sendOtp/${config.smsConfiguration.sender}`)

async function signUpVerification (userName, password, flag = false) {
  let userStatus =
    await isUserRegistered(userName, password, flag)
  if (userStatus === false) {
    let userData = await hashPasswordAndFormulateUserObject(userName, password, flag)
    if (userData === undefined)
      console.log('Couldnt secure/hash your password; Try again') // Say hashing went wrong
    else await storeUserData(userData, flag) // No user registered
  }
  else if (userStatus)
    console.log('You have already registered but not verified')
    // The user can request to send a verification link again
}

async function isUserRegistered (userName, password, flag) {
  let fetchResult = await dataBase.fetch(flag ? 'phonenumber' : 'email', userName)
  if (fetchResult === undefined)
    console.log('Oops!, something went wrong; Try again...')
  else {
    if (Object.keys(fetchResult).length === 0)
      return false
    else if (!fetchResult.verified)
      return true // User registered but not verified
    else
      console.log('You have already been registered and verified - Just Sign Up with the credentials')
  }
}

async function storeUserData (userData, flag) {
  let insertResult = await dataBase.insert(userData, flag)
  if(insertResult === undefined)
    console.log('Oops!, couldnt save your data in the DB; Try again...')
  else {
    if (!flag) // Upon storing, send a Verification link or a OTP
      sendVerificationLink(userData.email, userData.token)
    else {
      let from = config.smsConfiguration.from
      sendOtp(from, userData.phoneNumber, userData.otp)
    }
  }
}

module.exports = signUpVerification
