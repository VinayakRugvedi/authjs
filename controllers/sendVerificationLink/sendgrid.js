const config = require('../../config')
const apiKey = config.mailConfiguration.apiKey

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(apiKey)

function sendVerificationLink(email, token) {
  let mail = {
    from : 'Verifier <me@sendgrid.sample.org>',
    to : `${email}`,
    subject : 'Verifying You!',
    html : `<p>Click the below link to verify yourself : </p>
            <a href="http://localhost:5000/verify/${token}">
               http://localhost:5000/verify/${token}</a>`
  }

  sgMail.send(mail)
    .then(() => {
      console.log('Your data is securely stored and the verification link has been successfully sent; Check your inbox or spam folder')
        // msg : "Your data is securely stored and the verification link has been successfully sent; Check your inbox or spam folder"
    })
    .catch((error) => {
      console.log(error)
      console.log('Your data is securely stored but coudnt send the verification link!; Try again...')
        // msg : "Your data is securely stored but coudn't send the verification link!; Try again..."
    })
}

module.exports = sendVerificationLink
