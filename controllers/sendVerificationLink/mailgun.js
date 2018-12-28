const mailgunConfig = require('./mailgunConfig')()
const mailgun = require('mailgun-js')(mailgunConfig)

function sendVerificationLink(email, token, res) {
  let mail = {
    from : 'Anonymous <me@mailgun.sample.org>',
    to : `${email}`,
    subject : 'Verifying You!',
    html : `<p>Click the below link to verify yourself : </p>
            <a href="http://localhost:5000/verify/${token}">
               http://localhost:5000/verify/${token}</a>`
  }

  mailgun.messages().send(mail, (err, body) => {
    if(err) {
      console.log(err)
      res.status(502).json({
        msg : "Your data is securely stored but coudn't send the verification link!; Try again..."
      })
    } else {
      console.log(body)
      res.status(201).json({
        msg : "Your data is securely stored and the verification link has been successfully sent; Check your inbox or spam folder"
      })
    }
  })
}

module.exports = sendVerificationLink
