const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')

const { handleError } = require('../../middleware/utils')

const emailConstants = require("../../constants/email-templates/OtpEmail")

const emailConfig = require('../../../config/email.config')

var nodemailer = require('nodemailer');

const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const { response } = require('express')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

// Here generating OTP
exports.generateOTP = (otpLength) => {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < otpLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
// Get the time for next few minutes
exports.getForwardTime = (timeInMints) => {

  var forwardTime = new Date(Date.now() + (timeInMints * 60 * 1000));
  return forwardTime;
}
// Sending Emails
exports.sendEmailToCustomer = (mailSubject, toEmailId, content, otp) => {

  content = content.replace("$s1", otp.charAt(0));
  content = content.replace("$s2", otp.charAt(1));
  content = content.replace("$s3", otp.charAt(2));

  var emailTemplate = content.replace("$s4", otp.charAt(3));
  var transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: emailConfig.username, // your domain email address
      pass: emailConfig.password // your password
    }
  });

  var mailOptions = {
    from: emailConfig.username,
    to: toEmailId,
    subject: mailSubject + otp,
    html: emailTemplate
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    }
    else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  });
}

const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailExists(req.email)
    if (!doesEmailExists) {
      const otpValue = this.generateOTP(4);
      const getExpiryTime = this.getForwardTime(2.30);
      this.sendEmailToCustomer(emailConstants.mailSubject, req.email, emailConstants.htmlContent, otpValue);
      const item = await registerUser(req, otpValue, getExpiryTime)
      const userInfo = await setUserInfo(item, otpValue, getExpiryTime)
      const response = await returnRegisterToken(item, userInfo)
      const data = { status: 201, ...response }
      res.status(201).json(data)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
