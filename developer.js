const auth = require('./authjs')
// First set up the authConfig.js file!!!

// All functions return a promise!!!
// All arguments are strings!!!

// Email :
auth.signUp('yourname@example.com', '123password321')
// Phone Number :
auth.signUp('+91XXXXXXXXXX', '123password321')


// Email :
auth.verify(token) // token is 32 characters long
// Phone Number :
auth.verify('+91XXXXXXXXXX', '123456') // 123456 is the OTP

// Email :
auth.signIn('yourname@example.com', '123password321')
// Phone Number :
auth.signIn('+91XXXXXXXXXX', '123password321')

// Email :
auth.resendVerificationLink('yourname@example.com')
// Phone Number :
auth.resendOtp('+91XXXXXXXXXX')

// Email :
auth.changePassword('yourname@example.com', '123password321')
// Phone Number :
auth.changePassword('+91XXXXXXXXXX', '123password321')
