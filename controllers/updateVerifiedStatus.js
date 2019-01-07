const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function updateVerifiedStatus (identifier, otp = null) {
  let fetchResult = await dataBase.fetch(otp ? 'phoneNumber' : 'token', identifier)
  if (fetchResult === undefined)
    console.log('DB Error : OOPS!, something went wrong')
  else {
    if (Object.keys(fetchResult).length === 0)
      console.log('This link is invalid')
    else if (fetchResult.verified) console.log('You have already registered and verified, just SignUp!')
    else {
      !otp
        ? await takeActionBasedOnLinkExpiration(fetchResult)
          .catch((error) => console.log(error)) // Not required
        : await takeActionBasedOnOtpExpiration(fetchResult, otp)
          .catch((error) => console.log(error))
    }
  }
}

async function takeActionBasedOnLinkExpiration (fetchResult) {
  let isTokenValid = await isExpired(fetchResult.expires)
  if (!isTokenValid) {
    let updateResult = await dataBase.updateVerified(fetchResult._id)
    if (updateResult === undefined)
      console.log('Couldnt verifiy; Try clicking the link again after some time...(DB Error)')
    else
      console.log('Congratulations, You are verified...')
  } else console.log('The link has expired')
}

async function takeActionBasedOnOtpExpiration (fetchResult, otp) {
  if (Number(otp) === fetchResult.otp) {
    let isOtpValid = await isExpired(fetchResult.expires)
    if (!isOtpValid) {
      let updateResult = await dataBase.updateVerified(fetchResult._id)
      if (updateResult === undefined)
        console.log('Couldnt verifiy; Try clicking the link again after some time...(DB Error)')
      else
        console.log('Congratulations, You are verified...')
    } else console.log('The OTP has expired')
  } else console.log('Invalid OTP')
}

async function isExpired(time) {
  let currentTime = Date.now()
  return currentTime > time ? true : false
}

module.exports = updateVerifiedStatus
