# authjs

The ultimate library for performing authentication on nodeJS! -
Manages signUp(creation of user accounts), verification(verification link to email or an OTP to a phone number) and signIn...


### Installation
npm install authjs


### Prerequisite
**Set up your [authConfig file](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js) which is the driving force for all the magics of authjs!**

**For more detailed information on authConfig file, [navigate here...](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js)**


### What authjs does for you..?
Authentication!!!
Well, on an abstract note, authjs provides you with some async functions to achieve the following :

* To take in the email-address/phone-number(user-name) along with the password during signUp(registration) and store it on the data base of your choice(as specified in the authConfig file) by hashing the password.

* Then, as per the user-name(email-address/phone-number), authjs initiates the verification process either by sending a verification link(if the user-name is an email-address)(again as per your choice, as specified in the authConfig file) or by sending an OTP(if the user-name is a phone-number)(again as per your choice, as specified in the authConfig file) with an appropriate expiration time.

* To help you verify the user successfully when the verification link is clicked or when the OTP is provided.

* To take in the email-address/phone-number(user-name) along with the password during signIn and authenticate the user based on the credentials provided against the information available on the data base.


### What does authjs provide you..?
**All the functions provided by authjs returns a promise and always consumes arguments of type string**
The following represents the set of functions available as of now...

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
auth.changePassword('yourname@example.com', '123password321')
// Phone Number :
auth.changePassword('+91XXXXXXXXXX', '123password321')
```

Example usage : 
```javascript
auth.signUp('yourname@example.com', '123password321')
  .then(authObject => {
    console.log(authObject)
    . . . . .
    // Do something based on the authCode
    // authObject.authCode
    . . . . .
   })
   .catch(error => console.log(error))
   
   OR
   
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




