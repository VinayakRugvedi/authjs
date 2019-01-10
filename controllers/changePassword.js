const bcrypt = require('bcrypt')
const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function changePassword (userName, newPassword, flag = false) {
  const fetchResult =
    await dataBase.fetch(flag ? 'phoneNumber' : 'email', userName)
      .catch(error => { throw error })

  if (Object.keys(fetchResult).length === 0)
    return {
      message: `The user : ${userName} has not yet registered!`
    }
  else {
    // user info found, update its newPassword by hashing
    const hash =
      await bcrypt.hash(newPassword, 10)
        .catch(error => { throw error })

    await dataBase.updatePassword(hash, fetchResult._id)
      .catch(error => { throw error })

    return {
      message: `The user's(${userName}) password has been successfully updated`
    }
  }
}

module.exports = changePassword
