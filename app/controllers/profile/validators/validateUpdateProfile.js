const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates update profile request
 */
const validateUpdateProfile = 
   [check('Gender')
    .exists()
    .withMessage('Gender MISSING')
    .not()
    .isEmpty()
    .withMessage('Gender IS_EMPTY'),
  check('Date_of_Brith')
    .exists()
    .withMessage('Date_of_Brith MISSING')
    .not()
    .isEmpty()
    .withMessage('Date_of_Brith IS_EMPTY')
    .trim(),
  check('Height')
    .exists()
    .withMessage('Height MISSING')
    .not()
    .isEmpty()
    .withMessage('Height IS_EMPTY')
    .trim(),
    check('HeightUnit')
    .exists()
    .withMessage('HeightUnit MISSING')
    .not()
    .isEmpty()
    .withMessage('HeightUnit IS_EMPTY')
    .trim(),
  check('Weight')
    .exists()
    .withMessage('Weight MISSING')
    .not()
    .isEmpty()
    .withMessage('Weight IS_EMPTY')
    .trim(),
    check('WeightUnit')
    .exists()
    .withMessage('WeightUnit MISSING')
    .not()
    .isEmpty()
    .withMessage('WeightUnit IS_EMPTY')
    .trim(),
  (req, res, next) => {
    validateResult(req, res, next)
  }]

module.exports = { validateUpdateProfile}