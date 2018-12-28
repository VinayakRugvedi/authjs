const bcrypt = require('bcrypt')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function authenticateUser(email, password) {
  let passwordHash = await getHashIfAvailableAndAuthenticate(email)
  if(passwordHash === false) {
    console.log('There is no account registered with this email address; Register soon!')
    // msg : "Looks like you havent created an account yet; Create one soon"
  }
  else if(passwordHash)
    console.log('Your account has not been verified yet')
    // msg : "Your account has not been verified yet!; Check your inbox or spam folder..."
  else if(passwordHash !== undefined){
    let compareResult = await compare(passwordHash, password)
    if(compareResult === undefined)
      console.log('Oops!, something went wrong; Try again...')
    else if(compareResult === false)
      console.log('Your credentials seems to be incorrect!')
    else
      console.log('You have been successfully authenticated')
  }
}

async function getHashIfAvailableAndAuthenticate(email) {
  let fetchResult = await dataBase.fetch('email', email)
  if(fetchResult === undefined)
  console.log('Couldnt retrive data; Try again after some time...')
    //msg : 'Couldnt retrive data; Try again after some time...'
  else {
    if(Object.keys(fetchResult).length === 0)
      return false
    else if(!fetchResult.verified)
      return true
    else return fetchResult.password
  }
}

async function compare(hash, password) {
  let compareResult =
    await bcrypt.compare(req.body.password, hash)
      .catch((error) => console.log(error))

  return compareResult
}

module.exports = authenticateUser
