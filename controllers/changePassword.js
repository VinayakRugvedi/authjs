const bcrypt = require('bcrypt')
const config = require('../config')
const dataBase = require(`../model/${config.dataBaseConfiguration.dataBase}`)
const hashPasswordAndFormulateUserObject = require('./hashPasswordAndFormulateUserObject')

async function changePassword(email, password) {
  //lets say the password is being sent here after being validated with confirm password
  //should update it
  let fetchResult = await dataBase.fetch('email', email)
  if(fetchResult === undefined)
    console.log('Oops, something went wrong; Try again')
    //Oops, something went wrong; Try again
  else if(Object.keys(fetchResult).length === 0)
    console.log('There is no account registered with this email address; Register soon!')
    //There is no account registered with this email address
  else {
    //user info found, update its password
    //first hash the password
    const hash = await bcrypt.hash(password, 10)
                  .catch((error) => console.log(error))
    if(hash === undefined)
      console.log('Couldnt secure your password; Try again...')
      //Couldnt hash the password; Try again
    let updateResult = await dataBase.updatePassword(hash, fetchResult._id) //Should implement
    if(updateResult === undefined)
      console.log('Oops, something went wrong while storing your password; Try again')
      //DB error; Try again later
    else
      console.log('Successfully updated your password')
      //Successfully changed the password
  }
}

module.exports = changePassword
