const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function updateVerifiedStatus (identifier, otp = null) {
  const fetchResult =
    await dataBase.fetch(otp ? 'phoneNumber' : 'token', identifier)
      .catch(error => { throw error })

  if (Object.keys(fetchResult).length === 0) {
    if(identifier === 'phoneNumber')
      return {
        message: `The user : ${identifier} has not yet registered! -- Cannot verify`
      }
    return {
      message: `The token : ${identifier} is not a valid one(Invalid link) -- Cannot verify`
    }
  } else if (fetchResult.verified)
    return {
      message: `The user : ${fetchResult[identifier]} has already been registered and verified - User can now Sign In with his/her credentials`
    }
  else {
    const returnObject =
    !otp
      ? await takeActionBasedOnLinkExpiration(fetchResult)
        .catch(error => { throw error })
      : await takeActionBasedOnOtpExpiration(fetchResult, otp)
        .catch(error => { throw error })
    return returnObject
  }
}

async function takeActionBasedOnLinkExpiration (fetchResult) {
  const isTokenValid =
    await isExpired(fetchResult.expires)
      .catch(error => { throw error })

  if (!isTokenValid) {
    await dataBase.updateVerified(fetchResult._id)
      .catch(error => { throw error })

    return {
      message: `The user has been successfully verified`
    }
  } else
    return {
      message: `The verification link has been expired`
    }
}

async function takeActionBasedOnOtpExpiration (fetchResult, otp) {
  if (Number(otp) === fetchResult.otp) {
    const isOtpValid =
      await isExpired(fetchResult.expires)
        .catch(error => { throw error })

    if (!isOtpValid) {
      await dataBase.updateVerified(fetchResult._id)
        .catch(error => { throw error })

      return {
        message: `The user has been successfully verified`
      }
    } else
      return {
        messsage: `The OTP has expired`
      }
  } else
    return {
      message: `Invalid OTP`
    }
}

async function isExpired (time) {
  const currentTime = Date.now()
  return currentTime > time ? true : false
}

module.exports = updateVerifiedStatus
