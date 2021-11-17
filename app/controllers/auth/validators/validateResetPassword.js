const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates reset password request
 */
const validateResetPassword = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('otp')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 4
    })
    .withMessage('email or otp should not empty'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateResetPassword }
