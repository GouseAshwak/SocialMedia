const {
  isIDGood,
  handleError,
  buildErrObject
} = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { checkPassword } = require('../../middleware/auth')
const { findUser, changePasswordInDB } = require('./helpers')

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async (req, res) => {

  if(req.body.oldPassword === req.body.newPassword){
  res.status(400).send({ status: 400,message: "new password and old password should not be same!" });
  return;
  }
  try {
    const id = await isIDGood(req.user._id)
    const user = await findUser(id)
    req = matchedData(req)
    const isPasswordMatch = await checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      return handleError(res, buildErrObject(400, 'Sorry your password was incorrect Please try again'))
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { changePassword }
