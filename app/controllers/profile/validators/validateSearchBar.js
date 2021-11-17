/*
 * Validate Search Bar
 */
const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

const validateSearchBar = 
   [check('search_user')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    (req, res, next) => {
        validateResult(req, res, next)
      }
   ]

module.exports = {validateSearchBar}