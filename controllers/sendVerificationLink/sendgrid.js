const sgMail = require('@sendgrid/mail')
const apiKey = require('./sendgridConfig')
sgMail.setApiKey(apiKey)


function sendVerificationLink(email, token, res) {
  let mail = {
    from : 'Anonymous <me@sendgrid.sample.org>',
    to : `${email}`,
    subject : 'Verifying You!',
    html : `<p>Click the below link to verify yourself : </p>
            <a href="http://localhost:5000/verify/${token}">
               http://localhost:5000/verify/${token}</a>`
  }

  sgMail.send(mail)
    .then(() => {
      res.status(201).json({
        msg : "Your data is securely stored and the verification link has been successfully sent; Check your inbox or spam folder"
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(502).json({
        msg : "Your data is securely stored but coudn't send the verification link!; Try again..."
      })
    })
}

module.exports = sendVerificationLink
