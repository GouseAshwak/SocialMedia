/*
 * Validate create post
 */
const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

const validateCreatePost = 
   [check('Text')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('backgroundColor')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('align')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
    
    check('Photo')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

     check('postType')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    check('postCategory')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),

    (req, res, next) => {
        validateResult(req, res, next)
      }
   ]

module.exports = {validateCreatePost}