const config = require('../../config')
const apiKey = config.mailConfiguration.apiKey
const domain = config.mailConfiguration.domain

const mailgun = require('mailgun-js')({
  apiKey,
  domain
})

function sendVerificationLink(email, token) {
  let mail = {
    from : 'Verifier <me@mailgun.sample.org>',
    to : `${email}`,
    subject : 'Verifying You!',
    html : `<p>Click the below link to verify yourself : </p>
            <a href="http://localhost:5000/verify/${token}">
               http://localhost:5000/verify/${token}</a>`
  }

  mailgun.messages().send(mail, (error, body) => {
    if(error) {
      console.log(error)
      console.log('Your data is securely stored but coudnt send the verification link!; Try again...')
      //A new verification link can be requested
    } else {
      console.log(body)
      console.log('Your data is securely stored and the verification link has been successfully sent; Check your inbox or spam folder')
    }
  })
}

module.exports = sendVerificationLink
