# authjs

The ultimate package for authentication on nodeJS! -
Manages signUp(creation of user accounts), verification(verification link to email or an OTP to a phone number) and signIn...

### Installation
npm install authjs

### Prerequisite
**Set up your [authConfig file](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js) which is the driving force for all the magics of authjs!**
**For more detailed information on authConfig file, [navigate here...](https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js)**

### What authjs does for you..?
Authentication!!!
Well, on an abstract note :
auhjs takes in the email-address/phone-number(user-name) along with the password during the signUp and stores it on the data base of your choice(as specified in the authConfig file) by hashing the password.
Then, as per the user-name(email-address/phone-number), authjs initiates the verification process either by sending a verification link(if the user-name is an email-address) or by sending an OTP(if the user-name is a phone-number) with an appropriate expiration time.


