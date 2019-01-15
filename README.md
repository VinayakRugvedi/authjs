# authjs

The ultimate package for authentication on nodeJS! -
Manages signUp(creation of user accounts), verification(verification link to email or an
OTP to a phone number) and signIn...

Current stable version : v1.0.5

[![Known Vulnerabilities](https://snyk.io/test/github/VinayakRugvedi/authjs/badge.svg?targetFile=package.json)](https://snyk.io/test/github/VinayakRugvedi/authjs?targetFile=package.json)

### Installation
npm install @vinayakrugvedi/authjs

### Prerequisite
**Set up your [authConfig file](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js) which is the driving force for all the magics of authjs!**                                                                                                      
**For more detailed information on authConfig file, [navigate here...](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js)**

### What does authjs do for you..?
Authentication!!!

Well, on an abstract note, authjs provides you with some async functions to achieve the following :

* To take in the email-address/phone-number(user-name) along with the password during signUp(registration) and store it on the data base of your choice(as specified in the authConfig file) by hashing the password.

* Then, as per the user-name(email-address/phone-number), authjs initiates the verification process either by sending a verification link(if the user-name is an email-address)(again as per your choice, as specified in the authConfig file) or by sending an OTP(if the user-name is a phone-number)(again as per your choice, as specified in the authConfig file) with an appropriate expiration time.

* To help you verify the user successfully when the verification link is clicked or when the OTP is provided.

* To take in the email-address/phone-number(user-name) along with the password during signIn and authenticate the user based on the credentials provided against the information available on the data base.

### Why authConfig file..?
As told earlier, it's the driving force as it holds all of your choices and it's desired
configurations.

So, authjs as of now offers you two choices for the data base :
* mongodb
* postgresql

Two choices for the mailer, in order to send the verification link :
* mailgun
* sendgrid

And two choices for the sender, in order to send the OTP :
* nexmo
* twilio

Having the *dataBaseConfiguration* is mandatory  

You can either choose to have the *mailConfiguration* or the *smsConfiguration* or both of them based on the kind of user-names(email-address/phone-number) you are willing to encourage


[Click here for more detailed information](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js)

### What does authjs provide you..?
**All the functions provided by authjs returns a promise and always consumes arguments of type string**

The following represents the set of functions available as of now...

**Make sure you pass the email and phone number in the right format                      
Phone number format : (+)(country code)(phone number including area code), with no
special characters apart from '+'**                                                      

Example : +91XXXXXXXXXX                                                                  
The following will be considered invalid : (91) XXXXXXXXXX, +91 XXX-XXXX-XXX, +91 (XXX)XXXX(XXX)...


```javascript
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
auth.changePassword('yourname@example.com', '123newpassword321')
// Phone Number :
auth.changePassword('+91XXXXXXXXXX', '123newpassword321')
```

Based on the configurations you chosse in the *authConfig* file, you may either be provided with `auth.resendVerificationLink('yourname@example.com')` or `auth.resendOtp('+91XXXXXXXXXX')` or both if you choose too!

**I recommend you to have both, mailConfiguration and smsConfiguration as it provides much more flexibilty/choice for the users registering with you**


Example usage :
```javascript
const auth = require('@vinayakrugvedi/authjs')

auth.signUp('yourname@example.com', '123password321')
  .then(authObject => {
    console.log(authObject)
    . . . . .
    // Do something based on the authCode
    // authObject.authCode
    . . . . .
   })
   .catch(error => console.log(error))

 // OR using async-await

 async function someHandler() {
  let authObject =
    await auth.signUp('yourname@example.com', '123password321')
      .catch(error => console.log(error))
  . . . . .
  // Do something based on the authCode
  // authObject.authCode
  . . . . .
 }
```
authjs has a good amount of logs and throws simple, user understandable exceptions at times which makes it elegant to use!

When the promise gets resolved, you get an authObject with an underlying api's response, if any,
along with authCode and authMessage which gives a clear understanding of what happened...
(In most of the cases, authObject consists of only authCode and authMessage)
Based on the authCode, you can decide what to do next...

The following table summarizes all the possible authCodes which may arise at different scenarios :

authCode | meaning
-------- | -------
3 | The respective function call succeeded completely to the fullest
13 | The user-name(email-address/phone-number) in concern has not yet registered
14 | The user-name(email-address/phone-number) in concern has registered but not verified
15 | The user-name(email-address/phone-number) in concern has registered and is verified
23 | Invalid link/OTP
24 | Link/OTP has expired
25 | The users credentials are incorrect


Suggestions, queries and appreciations are welcome! :-)
