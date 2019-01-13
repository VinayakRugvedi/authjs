const cryptoRandomString = require('crypto-random-string')

const authConfig = require('../../../authConfig')
const dataBase = require(`../model/${authConfig.dataBaseConfiguration.dataBase}`)
const sendVerificationLink = require(`./sendVerificationLink/${authConfig.mailConfiguration.mailer}`)

async function resendVerificationLink (email) {
  const userData =
    await dataBase.fetch('email', email)
      .catch(error => { throw error })

  if(Object.keys(userData).length === 0)
    return {
      authCode: 13,
      authMessage: `The user : ${email} has not yet registered!`
    }
  else {
    if (userData.verified === true)
      return {
        authCode: 15,
        authMessage: `The user : ${email} has already been verified!`
      }

    const token = cryptoRandomString(32)
    const date = new Date()
    const expires = date.setUTCHours(date.getUTCHours() + 12)
    await dataBase.updateTokenAndExpires(userData._id, token, expires)
      .catch(error => { throw error })
    // Successfull updation
    // Send the link now
    const returnObject =
      await sendVerificationLink(userData.email, token)
        .catch(error => { throw error })

    returnObject.authMessage = `The verification link has been resent to : ${email}`
    return returnObject
  }
}

module.exports = resendVerificationLink
