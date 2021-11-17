//const { matchedData } = require('express-validator')
const { verificationExists, verifyUser } = require('./helpers')
const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

// Check registered Email 
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

//verify user with OTP
const verify = async (req, res) => {

  // Validate request
  if (!req.body.otp || !req.body.email) {
    res.status(400).send({ status: 400, message: "Email must not be empty!" });
    return;
  }

  const emailCheck = await this.checkEmailId(req.body.email);

  if (emailCheck && !emailCheck.is_verified) {

    if (Date.now() <= emailCheck.expiry_time && emailCheck.otp === req.body.otp) {

      User.updateOne({ email: req.body.email }, { $set: { is_verified: true } }).exec()
        .then((resultSet) => {
          res.status(200).send({ status: 200, message: "User has been verified successfully!!" });
        })
        .catch(Err => {
          res.status(500).send({
            status: 500,
            message:
              Err.message || "Some error occurred while verifying the user."
          });
        });
    } else {
      res.status(500).send({ status: 500, message: "something gone wrong with the verification" });
    }
  }

  if (emailCheck == null) {
    res.status(404).send({ status: 404, message: "EmailId is not found" });
  }

};

module.exports = { verify }