const bcrypt = require('bcrypt')
const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)

async function changePassword (userName, newPassword, flag = false) {
  // lets say the newPassword is being sent here after being validated with confirm newPassword
  // should update it
  let fetchResult = await dataBase.fetch(flag ? 'phoneNumber' : 'email', userName)
  if (fetchResult === undefined)
    console.log('DB Error : OOPS, something went wrong')
  else if (Object.keys(fetchResult).length === 0)
    console.log('There is no account registered with this User Name; Register soon!')
  else {
    // user info found, update its newPassword
    // first hash the newPassword
    const hash =
      await bcrypt.hash(newPassword, 10)
        .catch((error) => console.log(error))
    if (hash === undefined)
      console.log('Couldnt secure your newPassword; Try again...')
    let updateResult = await dataBase.updatePassword(hash, fetchResult._id)
    if (updateResult === undefined)
      console.log('DB Error : OOPS, something went wrong')
    else console.log('Successfully updated your newPassword')
  }
}

module.exports = changePassword
