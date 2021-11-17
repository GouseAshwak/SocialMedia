const { matchedData } = require('express-validator')

const { handleError } = require('../../middleware/utils')

const emailConstants = require("../../constants/email-templates/OtpEmail")

const emailConfig = require('../../../config/email.config')

const User = require('../../models/user')

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
//Check Email
exports.checkEmailId = async (emailId) => {

  // Validate request
  if (!emailId) {
    return null;
  }
  var cursor;

  await User.findOne({ email: emailId }).then(data => {
    cursor = data;
  })
    .catch(err => {
      cursor = null;
    });
  return cursor;
};

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


const setAgainOtp = async (req, res) => {

  if (!req.body.email || !req.body.reqType) {
    res.status(400).send({ status: 400, message: "Email should not be empty!" });
    return;
  }
  const emailCheck = await this.checkEmailId(req.body.email);
  const otpValue = this.generateOTP(4)
  const getExpiryTime = this.getForwardTime(2.30)

  if (emailCheck && !emailCheck.is_verified && req.body.reqType === 'signup') {
    User.updateOne({ email: emailCheck.email }, { $set: { otp: otpValue, expiry_time: getExpiryTime } }).exec()
      .then((emailCheck) => {

        this.sendEmailToCustomer(emailConstants.mailSubject, req.body.email, emailConstants.htmlContent, otpValue);

        res.status(200).send({ status: 200, message: "Email Verification has been sent successfully!!" });
      })
      .catch(Err => {
        res.status(500).send({
          status: 500,
          message:
            Err.message || "Some error occurred while recovering the account."
        });
      });
  }

  else if (emailCheck && emailCheck.is_verified && req.body.reqType === 'recover') {
    User.updateOne({ email: emailCheck.email }, { $set: { otp: otpValue, expiry_time: getExpiryTime } }).exec()
      .then((emailCheck) => {

        this.sendEmailToCustomer(emailConstants.recoverPasswordSubject, req.body.email, emailConstants.htmlContent, otpValue);

        res.status(200).send({ status: 200, message: "Email Verification has been sent successfully!!" });
      })
      .catch(Err => {
        res.status(500).send({
          status: 500,
          message:
            Err.message || "Some error occurred while recovering the account."
        });
      });
  }

  else {
    res.status(400).send({
      status: 400,
      message: "User Already Verified."
    });
  }

}

module.exports = { setAgainOtp }