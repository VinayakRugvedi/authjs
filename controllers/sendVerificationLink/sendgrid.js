const authConfig = require('../../../../../authConfig')
const apiKey = authConfig.mailConfiguration.apiKey

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(apiKey)

async function sendVerificationLink (email, token) {
  let from = 'Verifier <me@sendgrid.sample.org>'
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
        'route' field is essential in the 'mailConfiguration' of 'authConfig' file
        For more detailed information regarding the route and the authConfig filenavigate to here :
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
    html: `<p>Click the below link to get verified at ${organizationName} </p>
            <a href="${route}/${token}">
            ${route}/${token}</a>`
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
