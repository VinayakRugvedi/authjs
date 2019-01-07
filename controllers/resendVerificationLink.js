const cryptoRandomString = require('crypto-random-string')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const sendVerificationLink = require(`./sendVerificationLink/${config.mailConfiguration.mailer}`)

async function resendVerificationLink(email) {
  let userData = await dataBase.fetch('email', email)
  if(userData === undefined)
    console.log('Oops, something went wrong; Try again later')
    //Oops, something went wrong; Try again later
  else if(Object.keys(userData).length === 0)
    console.log('There is no account registered with this email address; Register soon!')
    //This email isnt registered yet; Register soon
  else {
    //Should i check the verified status..?
    let token = cryptoRandomString(32)
    let date = new Date()
    let expires = date.setUTCHours(date.getUTCHours() + 2)
    let updateResult = await dataBase.updateTokenAndExpires(userData._id, token, expires)
    if(updateResult === undefined)
      console.log('Oops something went wrong; Try again')
      //Oops something went wrong; Try again
    else
      //Successfull updation
      //Send the link now
      sendVerificationLink(userData.email, token)
  }
}

module.exports = resendVerificationLink
