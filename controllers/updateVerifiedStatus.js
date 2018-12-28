const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function updateVerifiedStatus(token) {
  let fetchResult = await dataBase.fetch('token', token)
  if(fetchResult === undefined)
    console.log('Couldnt retrive your data; Try clicking the link again after some time...')
    // msg : 'Couldnt retrive data; Try clicking the link again after some time...'
  else {
    if(Object.keys(fetchResult).length === 0)
      console.log('This link is invalid and we dont have your data, kindle sign up first!')
      // msg : 'This link is invalid and we dont have your data, kindle sign up again!'
    else await takeActionBasedOnLinkExpiration(fetchResult, res)
          .catch((error) => console.log(error)) //Not required
  }
}

async function takeActionBasedOnLinkExpiration(fetchResult, res) {
  let isLinkValid = await isExpired(fetchResult.expires, fetchResult._id, res)
  if(!isLinkValid) {
    let updateResult = await dataBase.updateVerified(fetchResult._id)
    if(updateResult === undefined)
      console.log('Couldnt verifiy; Try clicking the link again after some time...(DB Error)')
      // msg : 'Couldnt set data; Try clicking the link again after some time...'
    else
      console.log('Congratulations, You are verified...')
      // msg : 'Congratulations, You are verified...'
  }
}

async function isExpired(time, id, res) {
  let currentTime = Date.now()
  if(currentTime > time) {
    let deleteResult = await dataBase.deleteData(id)
    if(deleteResult === undefined)
      console.log('Oops!, something went wrong; Try again...')
      // msg : 'Oops!, something went wrong; Try again...'
    else
      console.log('The verification link has expired; Should I resend..?')
      // msg : 'The verification link has expired; Kindle re-register at the registration page'
  }
  else return false
}

module.exports = updateVerifiedStatus
