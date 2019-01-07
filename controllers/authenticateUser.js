const bcrypt = require('bcrypt')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function authenticateUser (userName, password, flag = false) {
  let passwordHash = await getHashIfAvailableAndAuthenticate(userName, flag)
  console.log(passwordHash)
  if (passwordHash === false)
    console.log('There is no account registered with this userName; Register soon!')
  else if (passwordHash === true)
    console.log('Your account has not been verified yet')
  else if (typeof passwordHash === 'string') {
    let compareResult = await compare(passwordHash, password)
    if (compareResult === undefined)
      console.log('Oops!, something went wrong; Try again...')
    else if (compareResult === false)
      console.log('Your credentials seems to be incorrect!')
    else console.log('You have been successfully authenticated')
  }
}

async function getHashIfAvailableAndAuthenticate (userName, flag) {
  let fetchResult = await dataBase.fetch(flag ? 'phonenumber' : 'email', userName)
  if (fetchResult === undefined)
  console.log('DB Error : OOPS, something went wrong')
  else {
    if (Object.keys(fetchResult).length === 0)
      return false
    else if (!fetchResult.verified)
      return true
    else return fetchResult.password
  }
}

async function compare (hash, password) {
  let compareResult =
    await bcrypt.compare(password, hash)
      .catch((error) => console.log(error))

  return compareResult
}

module.exports = authenticateUser
