const authConfig = require('../../../authConfig')
const dataBase = require(`../model/${authConfig.dataBaseConfiguration.dataBase}`)

async function updateVerifiedStatus (identifier, otp = null) {
  if (validator.isMobilePhone(identifier, 'any', { strictMode: true })) {
    if(otp === null)
      throw new Error (
        `
          *******************************************************************************
          You need to pass an OTP too along with the phoneNumber in order to verify
          i.e auth.verify(phoneNumber, otp)
          *******************************************************************************
        `)
  }

  const fetchResult =
    await dataBase.fetch(otp ? 'phone' : 'token', identifier)
      .catch(error => { throw error })

  if (Object.keys(fetchResult).length === 0) {
    if(otp !== null)
      return {
        authCode: 13,
        authMessage: `The user : ${identifier} has not yet registered! -- Cannot verify`
      }
    return {
      authCode: 23,
      authMessage: `The token : ${identifier} is not a valid one(Invalid link) -- Cannot verify`
    }
  } else if (fetchResult.verified) {
    const user = fetchResult.email ? fetchResult.email : fetchResult.phone
    return {
      authCode: 15,
      authMessage: `The user : ${user} has already been registered and verified - User can now Sign In with his/her credentials`
    }
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
      authCode: 3,
      authMessage: `The user : ${fetchResult.email} has been successfully verified`
    }
  } else
    return {
      authCode: 24,
      authMessage: `The verification link has been expired`
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
        authCode: 3,
        authMessage: `The user : ${fetchResult.phone} has been successfully verified`
      }
    } else
      return {
        authCode: 24,
        messsage: `The OTP has expired`
      }
  } else
    return {
      authCode: 23,
      authMessage: `Invalid OTP`
    }
}

async function isExpired (time) {
  const currentTime = Date.now()
  return currentTime > time ? true : false
}

module.exports = updateVerifiedStatus
