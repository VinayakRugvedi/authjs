const config = require('../../config')
const apiKey = config.mailConfiguration.apiKey
const domain = config.mailConfiguration.domain

const mailgun = require('mailgun-js')({
  apiKey,
  domain
})

async function sendVerificationLink (email, token) {
  const mail = {
    from: 'Verifier <me@mailgun.sample.org>',
    to: `${email}`,
    subject: 'Verifying You!',
    html: `<p>Click the below link to verify yourself : </p>
            <a href="http://localhost:5000/verify/${token}">
               http://localhost:5000/verify/${token}</a>`
  }

  function sendMail () {
    return new Promise((resolve, reject) => {
      mailgun.messages().send(mail, (error, body) => {
        if (error) reject(error)
        else resolve(body)
      })
    })
  }

  const responseData =
    await sendMail()
      .catch(error => { throw error })

  return {
    mailgunResponse: responseData,
    message: `The user data is securely stored and the verification link has been sent to : ${email}`
  }
}

module.exports = sendVerificationLink
