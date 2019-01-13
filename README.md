# authjs
<<<<<<< HEAD
=======

The ultimate package for authentication on nodeJS! -
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




>>>>>>> refs/remotes/origin/master
