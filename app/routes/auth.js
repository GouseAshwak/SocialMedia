const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  login,
  roleAuthorization,
  setNewPassword,
  createUser_ID,
  setAgainOtp
} = require('../controllers/auth')

const {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin,
  validateSetNewPassword
} = require('../controllers/auth/validators')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/register', trimRequest.all, validateRegister, register)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Before Reset password Verify OTP route
 */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * sentAgainOTP API route for the user didnt recive otp in (forget password, Login and singup).
 */
router.post('/setAgainOtp', trimRequest.all, setAgainOtp)

/*
 * Set New password route
 */
router.post('/setNew', trimRequest.all,validateSetNewPassword, setNewPassword)
/*
 * createUser_ID route
 */
router.post('/createUser_ID', trimRequest.all, createUser_ID)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin, login)

module.exports = router