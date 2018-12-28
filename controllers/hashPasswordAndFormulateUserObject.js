const cryptoRandomString = require('crypto-random-string')
const bcrypt = require('bcrypt')

async function hashPasswordAndFormulateUserObject(email, password, userData = null) {
  let token = cryptoRandomString(32)
  let date = new Date()
  if(userData === null) {
    userData = {
      token,
      email : email,
      expires : date.setUTCHours(date.getUTCHours() + 2), //Future time in ms from Jan 1, 1970
      verified : false
    }
  }

  const hash =
    await bcrypt.hash(password, 10)
      .catch((error) => console.log(error))

  if(hash === undefined)
    console.log('Couldnt securely store your password; Try Again...')
    //msg : 'Couldnt securely store your password; Try Again... '
  else {
    console.log(hash)
    userData.password = hash
    return userData
  }
}

module.exports = hashPasswordAndFormulateUserObject
