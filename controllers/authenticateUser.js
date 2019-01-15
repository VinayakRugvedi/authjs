const validator = require('validator')
const bcrypt = require('bcryptjs')

const authConfig = require('../../../../authConfig')
const dataBase = require(`../model/${authConfig.dataBaseConfiguration.dataBase}`)

async function authenticateUser (userName, password) {
  let isPhone = false
  if (!validator.isEmail(userName)) {
    if (validator.isMobilePhone(userName, 'any', { strictMode: true })) isPhone = true
    else {
      throw new Error(
        `
        *******************************************************************************
        The email/phoneNumber passed to 'signIn' function of auth
        is not in the right format!

        If you are passing a phone number ensure that it doesn't have any special
        characters(except '+') and is in this format only :
                   [+][country code][subscriber number including area code],
        with no special characters!
        *******************************************************************************
        `)
    }
  }

  const passwordHash =
    await getHashIfAvailableAndAuthenticate(userName, isPhone)
      .catch(error => { throw error })

  if (passwordHash === false) {
    return {
      authCode: 13,
      authMessage: `The user : ${userName} has not yet registered! -- Cannot SignIn`
    }
  } else if (passwordHash === true) {
    return {
      authCode: 14,
      authMessage: `The user : ${userName} has already registered but not verified! -- Cannot SignIn`
    }
  } else if (typeof passwordHash === 'string') {
    const compareResult =
      await compare(passwordHash, password)
        .catch(error => { throw error })

    if (compareResult === false) {
      return {
        authCode: 25,
        authMessage: `The user's(${userName}) credentials seems to be incorrect`
      }
    } else {
      return {
        authCode: 3,
        authMessage: `The user : ${userName} is successfully authenticated/signedIn`
      }
    }
  }
}

async function getHashIfAvailableAndAuthenticate (userName, isPhone) {
  const fetchResult =
    await dataBase.fetch(isPhone ? 'phone' : 'email', userName)
      .catch(error => { throw error })

  if (Object.keys(fetchResult).length === 0) { return false } else if (!fetchResult.verified) { return true } else return fetchResult.password
}

async function compare (hash, password) {
  const compareResult =
    await bcrypt.compare(password, hash)
      .catch(error => { throw error })

  return compareResult
}

module.exports = authenticateUser
