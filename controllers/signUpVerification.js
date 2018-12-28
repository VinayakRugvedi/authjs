const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const sendVerificationLink = require(`./sendVerificationLink/${config.mailConfiguration.mailer}`)

async function signUpVerification(email, password) {
  let isUserRegistered = await isUserRegistered(email, password)
  if(isUserRegistered === false) {
    let userData = await hashPasswordAndFormulateUserObject(email, password)
    if(userData === undefined)
      console.log('Couldnt secure/hash your password; Try again') //Say hashing went wrong
    else await storeUserData(userData)  //No user registered
  }
  else if(isUserRegistered)
    console.log('You have already registered but not verified')
    //The user can request to send a verification link again
}

async function isUserRegistered(email, password) {
  let fetchResult = await dataBase.fetch('email', email)
  if(fetchResult === undefined)
    console.log('Oops!, something went wrong; Try again...')
  else {
    if(Object.keys(fetchResult).length === 0)
      return false
    else if(!fetchResult.verified)
      return true
      //user registered but not verified
    else
      console.log('You have already been registered and verified - Just Sign Up with the credentials')
      //msg : 'You have already been verified - Just Sign Up with the credentials'
  }
}

async function storeUserData(userData) {
  let insertResult = await dataBase.insert(userData)
  if(insertResult === undefined)
    console.log('Oops!, couldnt save your data in the DB; Try again...')
    //msg : 'Oops!, couldnt save your data in the DB; Try again...'
  else
    // Upon storing, send a Verification link
    sendVerificationLink(userData.email, userData.token, res)
}
