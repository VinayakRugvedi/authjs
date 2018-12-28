// Thank you for using this verification-Authentication SERVER

/*
******************** The Control flow ************************
# The user provides his/her email address, password, confirmed password

# The details provided are validated on a basic note
  :: Dependency -- Validator

# Once the validations are successfull,
  # The email is checked against the infos available on the DB, to prevent the
    duplication of users info on DB -- subsequently an appropriate action is taken

  # The password is hashed
    :: Dependency -- bcrypt

  # The details are then stored in either of the DBs
    :: postgresql -- pg
    :: mongoDB -- mongoose

  # Upon successfull storage, a verification link with an
    expiration is sent to the email address provided
    :: Dependency -- crypto-random-string - for tokens
    :: Dependency -- mailgun-js or sendgrid
**************************************************************
*/

// Please ensure to have the right support before configuring
const dataBaseConfiguration = {
  dataBase :
  /* 'postgresql' or 'mongodb' */

  connectionString :
  /* 'postgresql://dbuser:secretpassword@database.server.com:port/mydb'
    or
      'mongodb+srv://dbuser:secretpassword@cluster0-synfk.mongodb.net/test?retryWrites=true'
  */
}

const mailConfiguration = {
  mailer :
  /* mailgun or sendgrid*/

  apiKey :
  /* Provide your private key here
     example : 'XXXXXX2b715c9a0790994f135XXXXXXX-b378XXXX-eb713XXX'
  */
  domain :
  //Required only if the mailer is set to mailgun
  /* Provide your sandbox/custom domain name (mailgun)
     example : 'sandboxXXXXXX392eb64c2aaf4459fa2cXXXXXX.mailgun.org'
  */
}

module.exports = {
  dataBaseConfiguration,
  mailConfiguration
}
