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
 createPost,
 myPost,
 allPost,
 postEdit,
 deletePost,
 likeOrUnlikePost,
 viewPost,
 commentPost,
 deleteComment,
 likeComment,
 unlikeComment,
 commentList
} = require('../controllers/post')

const {
validateCreatePost
} = require('../controllers/post/validator')

const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

/*
 * Post routes
 */

/*
 * Create post route
 */
router.post(
  '/createPost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  /*upload.single('file')*/ upload.array('file', 10),
  validateCreatePost,
  createPost
)

/*
 * get myPost route
 */
router.post(
  '/myPost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  myPost
)

/*
 * get all post route
 */
router.get(
  '/allPosts',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  allPost
)

/*
 * edit post route
 */
router.put(
  '/editPost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  postEdit
)

/*
 * delete myPost route
 */
router.delete(
  '/deletePost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  deletePost
)

/*
 * likeOrUnlike Post route
 */
router.patch(
  '/likeOrUnlike',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  likeOrUnlikePost
)

/*
 * viewPost route
 */
router.post(
  '/viewPost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  viewPost
)

/*
 * Comment Post route
 */
router.post(
  '/commentPost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  commentPost
)

/*
 * delete Comment in Post route
 */
router.delete(
  '/deleteComment',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  deleteComment
)

/*
 * like Comment in Post route
 */
router.patch(
  '/likeComment',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  likeComment
)

/*
 * unlike Comment in Post route
 */
router.patch(
  '/unlikeComment',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  unlikeComment
)

/*
 * list Comments for a Post route
 */
router.post(
  '/commentList',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  commentList
)
module.exports = router