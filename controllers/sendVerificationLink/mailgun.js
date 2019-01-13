const authConfig = require('../../../../authConfig')
const apiKey = authConfig.mailConfiguration.apiKey
const domain = authConfig.mailConfiguration.domain

const mailgun = require('mailgun-js')({
  apiKey,
  domain
})

async function sendVerificationLink (email, token) {
  if(authConfig.mailConfiguration.domain === undefined ||
     authConfig.mailConfiguration.domain.length === 0) {
    throw new ReferenceError(
      `
        **********************************************************************************
        Since you are using mailgun,
        'domain' field is essential in the 'mailConfiguration' of the 'authConfig' file
        For more detailed information regarding the domain and the authConfig file,
        navigate to :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        **********************************************************************************
      `)
  }

  let from = 'Verifier <me@mailgun.sample.org>'
  if (authConfig.mailConfiguration.from !== undefined &&
     authConfig.mailConfiguration.from.length !== 0) {
    from = authConfig.mailConfiguration.from
  }

  let route
  if (authConfig.mailConfiguration.route === undefined ||
     authConfig.mailConfiguration.route.length === 0) {
    throw new ReferenceError(
      `
      **********************************************************************************
      'route' field is essential in the 'mailConfiguration' of the 'authConfig' file
      For more detailed information regarding the route and the authConfig file,
      navigate to :
      https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
      **********************************************************************************
      `)
  }
  route = authConfig.mailConfiguration.route

  let organizationName = 'TESTING'
  if (authConfig.mailConfiguration.organizationName !== undefined &&
      authConfig.mailConfiguration.organizationName.length !== 0) {
    organizationName = authConfig.mailConfiguration.organizationName
  }

  const mail = {
    from,
    to: `${email}`,
    subject: 'Verifying You!',
    html: `<p>Click the below link to get verified at ${organizationName} : </p>
            <a href="${route}/${token}">
            ${route}/${token}</a>`
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
    authCode: 3,
    authMessage: `The user data is securely stored and the verification link has been sent to : ${email}`
  }
}

module.exports = sendVerificationLink
