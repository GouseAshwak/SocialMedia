const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { roleAuthorization } = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {
retrieveChat,
uploadImage,
conversationList
 } = require('../controllers/chat');
 
 const multer = require("multer");
 var storage = multer.memoryStorage();
 var upload = multer({ storage: storage });

/*
 *retrieveChat routes
 */
router.post(
    '/retrieveChat',
    requireAuth,
    roleAuthorization(['user', 'admin']),
    trimRequest.all,
    retrieveChat
)

/*
 *conversationList routes
 */
 router.post(
  '/conversationList',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  conversationList
)

/*
 *upload Image routes
 */
 router.post(
  '/uploadImage',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  upload.array('file', 10),
  uploadImage
)
module.exports = router