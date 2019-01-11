const bcrypt = require('bcrypt')

const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function authenticateUser (userName, password, flag = false) {
  const passwordHash =
    await getHashIfAvailableAndAuthenticate(userName, flag)
      .catch(error => { throw error })

  if (passwordHash === false)
    return {
      authCode: 13,
      authMessage: `The user : ${userName} has not yet registered!`
    }
  else if (passwordHash === true)
    return {
      authCode: 14,
      authMessage: `The user : ${userName} has registered but not verified!`
    }
  else if (typeof passwordHash === 'string') {
    const compareResult =
      await compare(passwordHash, password)
        .catch(error => { throw error })

    if (compareResult === false)
      return {
        authCode: 25,
        authMessage: `The users credentials seems to be incorrect`
      }
    else
      return {
        authCode: 3,
        authMessage: `The user is successfully authenticated`
      }
  }
}

async function getHashIfAvailableAndAuthenticate (userName, flag) {
  const fetchResult =
    await dataBase.fetch(flag ? 'phonenumber' : 'email', userName)
      .catch(error => { throw error })

  if (Object.keys(fetchResult).length === 0)
    return false
  else if (!fetchResult.verified)
    return true
  else return fetchResult.password
}

async function compare (hash, password) {
  const compareResult =
    await bcrypt.compare(password, hash)
      .catch(error => { throw error })

  return compareResult
}

module.exports = authenticateUser
