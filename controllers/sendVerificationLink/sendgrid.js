const config = require('../../config')
const apiKey = config.mailConfiguration.apiKey

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(apiKey)

async function sendVerificationLink (email, token) {
  const mail = {
    from: 'Verifier <me@sendgrid.sample.org>',
    to: `${email}`,
    subject: 'Verifying You!',
    html: `<p>Click the below link to verify yourself : </p>
            <a href="http://localhost:5000/verify/${token}">
               http://localhost:5000/verify/${token}</a>`
  }

  const responseData =
    await sgMail.send(mail)
      .catch(error => { throw error })

  return {
    sendgridResponse: responseData,
    authCode: 3,
    authMessage: `The user data is securely stored and the verification link has been sent to : ${email}`
  }
}

module.exports = sendVerificationLink
