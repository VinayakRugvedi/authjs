// Thank you for using authjs

/*
  *************************************************************************************
  1. Create a file named 'authConfig.js' in the same directory as of the nodemodules
      (Your root directory)
  2. For easy going, I recommend you to copy-paste this files' contents as it is into
      your authConfig file :-)
  3. NOTE : Once you copy all the contents from this file, setting up your
      dataBaseConfiguration object is mandatory.
      However, you can either set the mailConfiguration object or the smsConfiguration
      object or both!
      ***************
      Based on which configuration object you set, uncomment the corresponding export line at the bottom of this file!
      ***************
  *************************************************************************************
*/


//  dataBaseConfiguration is mandatory!
const dataBaseConfiguration = {
  dataBase: '',
  /* 'postgresql' or 'mongodb' */

  connectionString: ''
  // Required to connect to the data base you choose...
  /*
    'postgresql://dbuser:secretpassword@database.server.com:port/mydb'
    or
    'mongodb+srv://dbuser:secretpassword@cluster0-synfk.mongodb.net/mydb?retryWrites=true'
  */
}

/*
  You can either choose to take in user's email address during signUp and send them a
  verification link or take in user's phone number and send them an OTP for verification
  or handle both of them...

  However, I recommend you to opt for both the ways!!!
*/

// Ensure that you atleast set one of the configuration objects...

// Set up the mailConfiguration object for sending verification links to the user  provided email address
const mailConfiguration = {
  mailer: '',
  /* mailgun or sendgrid */

  apiKey: '',
  /*
     Provide your private key here
     example : 'XXXXXX2b71XXXXXX90994f135XXXXXXX-XX78XXXX-XX713XXX'
  */

  domain: '',
  // Required only if the mailer is set to mailgun
  /*
     Provide your sandbox/custom domain name (mailgun)
     example : 'sandboxXXXXXX392eXXXXXXXX4459fa2cXXXXXX.mailgun.org'
  */

  from: '',
  /*
     Format : 'Name <me@mailer.sample.org>'
     If not provided, the folowing defaults will be used -
     Default : 'Verifier <me@mailgun.sample.org>', in the case of mailgun
               'Verifier <me@sendgrid.sample.org>', in the case of sendgrid
  */

  organizationName: '',
  /*
    Provide your organization name by means of which the user recognizes
    the source of the verification link sent to him/her
    If not provided, 'TESTING' would be used as the default name
  */

  route: ''
  /*
     Provide the route which will be sent as the verification link(with a token suffixed) to the users email address; (You will need to handle this route as authjs needs this token for verification)
     *********************************************************************************
     NOTE :
     Your route will be suffixed by a 32 character long token
     i.e if you provide your route as : http://localhost:3000/verify,
     it will be transformed to : http://localhost:3000/verifiy/01234567890123456789012
     345678901234, where 01234567890123456789012345678901234 is the token!
     **********************************************************************************
  */
}

// Set up the smsConfiguration object for sending OTPs to the user provided phone number
const smsConfiguration = {
  sender: '',
  /* nexmo or twilio */

  from: '',
  /*
    A Valid phone number in the format :
    [+][country code][phone number including area code] or shortcode, or alphanumeric sender
  */

  organizationName: '',
  /*
    Provide your organization name by means of which the user recognizes
    the source of the OTP sent to him/her
    If not provided, 'TESTING' would be used as the default name
  */

  // Nexmo
  apiKey: '',
  apiSecret: '',
  /*
    If you have set the sender as 'nexmo',
    Provide your Nexmo's apiKey and apiSecret
  */

  // Twilio
  accountSid: '',
  authToken: ''
  /*
    If you have set the sender as 'twilio',
    Provide your Twilios's accountSid and authToken
  */
}

/*
  Uncomment the exports based on what you have chosen and configured
*/
module.exports = {
  dataBaseConfiguration,
  // mailConfiguration, // Uncomment this line, if you are using the mailConfiguration
  // smsConfiguration // Uncomment this line, if you are using the smsConfiguration
}
