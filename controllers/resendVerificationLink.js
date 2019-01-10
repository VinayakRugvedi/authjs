const cryptoRandomString = require('crypto-random-string')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const sendVerificationLink = require(`./sendVerificationLink/${config.mailConfiguration.mailer}`)

async function resendVerificationLink (email) {
  const userData =
    await dataBase.fetch('email', email)
      .catch(error => { throw error })

  if(Object.keys(userData).length === 0)
    return {
      message: `The user : ${email} has not yet registered!`
    }
  else {
    if (userData.verified === true)
      return {
        message: `The user : ${email} has already been verified!`
      }

    const token = cryptoRandomString(32)
    const date = new Date()
    const expires = date.setUTCHours(date.getUTCHours() + 2)
    await dataBase.updateTokenAndExpires(userData._id, token, expires)
      .catch(error => { throw error })
    // Successfull updation
    // Send the link now
    await sendVerificationLink(userData.email, token)
      .catch(error => { throw error })

    return {
      message: `The verification link has been resent to : ${email}`
    }
  }
}

module.exports = resendVerificationLink
