const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendOtp = async (phone, otp) => {
  return client.messages.create({
    body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    from: twilioPhone,
    to: phone,
  });
};

module.exports = { sendOtp };
