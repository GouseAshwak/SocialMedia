const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
const { password } = require('../../../../config/email.config')


/**
 * Validates login request
 */
const validateLogin = [

 check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('emailID or userName should not be empty')
  ,

    /*check('password').custom(password => {
      if (password == "") {
        throw new Error('password should not be empty')
      }
      else if(password.length < 5){
      throw new Error('password length should not be less than five')
      }
    }),*/

 check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('password should not be empty')
    .isLength({
      min: 5
    })
    .withMessage('password length should not be less than five'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateLogin }
