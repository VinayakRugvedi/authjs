const validator = require('validator')
const bcrypt = require('bcryptjs')

const authConfig = require('../../../../authConfig')
const dataBase = require(`../model/${authConfig.dataBaseConfiguration.dataBase}`)

async function changePassword (userName, newPassword) {
  let isPhone = false
  if (!validator.isEmail(userName)) {
    if (validator.isMobilePhone(userName, 'any', { strictMode: true })) isPhone = true
    else {
      throw new Error(
        `
          *******************************************************************************
          The email/phoneNumber passed to 'changePassword' function of auth
          is not in the right format!

          If you are passing a phone number ensure that it doesn't have any special
          characters(except '+') and is in this format only :
                    [+][country code][subscriber number including area code],
          with no special characters!
          *******************************************************************************
        `)
    }
  }

  const fetchResult =
    await dataBase.fetch(isPhone ? 'phone' : 'email', userName)
      .catch(error => { throw error })

  if (Object.keys(fetchResult).length === 0) {
    return {
      authCode: 13,
      authMessage: `The user : ${userName} has not yet registered!`
    }
  } else {
    // user info found, update its newPassword by hashing
    const hash =
      await bcrypt.hash(newPassword, 10)
        .catch(error => { throw error })

    await dataBase.updatePassword(hash, fetchResult._id)
      .catch(error => { throw error })

    return {
      authCode: 3,
      authMessage: `The user's(${userName}) password has been successfully updated`
    }
  }
}

module.exports = changePassword
