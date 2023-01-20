const Nexmo = require("nexmo");

const authConfig = require("../../../../../authConfig");
const apiKey = authConfig.smsConfiguration.apiKey;
const apiSecret = authConfig.smsConfiguration.apiSecret;

const nexmo = new Nexmo({
  apiKey,
  apiSecret,
});

async function sendOtp(phone, otp) {
  let organizationName = "TESTING";
  if (
    authConfig.smsConfiguration.organizationName !== undefined &&
    authConfig.smsConfiguration.organizationName.length !== 0
  ) {
    organizationName = authConfig.smsConfiguration.organizationName;
  }

  let from;
  if (
    authConfig.smsConfiguration.from === undefined ||
    authConfig.smsConfiguration.from.length === 0
  ) {
    throw new ReferenceError(
      `
        **********************************************************************************
        'from' field is essential with a valid value in the 'smsConfiguration' of
        'authConfig' file
        For more detailed information regarding the 'from' and the 'authConfig' file
        navigate to here :
        https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js
        **********************************************************************************
      `
    );
  }
  from = authConfig.smsConfiguration.from;

  const text = `Hello, your OTP is : ${otp} - ${organizationName}`;

  function sendSms() {
    return new Promise((resolve, reject) => {
      nexmo.message.sendSms(from, phone, text, (error, responseData) => {
        if (error) reject(error);
        else resolve(responseData);
      });
    });
  }

  const responseData = await sendSms().catch((error) => {
    throw error;
  });

  return {
    nexmoResponse: responseData,
    authCode: 3,
    authMessage: `The user data is securely stored and the OTP has been sent to ${phone}`,
  };
}

module.exports = sendOtp;
