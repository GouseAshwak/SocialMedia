const { forgotPassword } = require('./forgotPassword')
const { getRefreshToken } = require('./getRefreshToken')
const { login } = require('./login')
const { register } = require('./register')
const { resetPassword } = require('./resetPassword')
const { roleAuthorization } = require('./roleAuthorization')
const { verify } = require('./verify')
const {setNewPassword} = require('./setNewPassword')
const {createUser_ID} = require('./createUser_ID')
const {setAgainOtp} = require('./setAgainOtp')

module.exports = {
  forgotPassword,
  getRefreshToken,
  login,
  register,
  resetPassword,
  roleAuthorization,
  verify,
  setNewPassword,
  createUser_ID,
  setAgainOtp
}
