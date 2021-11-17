const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const {
  getProfile,
  updateProfile,
  changePassword,
  sideBarDetails,
  currentLocation,
  searchUser,
  follow,
  unfollow,
  removeFollower,
  follower_following_list,
  SuggestedUsers,
  logout
} = require('../controllers/profile')

const {
  validateUpdateProfile,
  validateChangePassword,
  validateAboutMe,
  validateLocation,
  validateSearchBar,
  validateFollowID,
  validateUnfollowID
} = require('../controllers/profile/validators')

const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

/*
 * Profile routes
 */

/*
 * Get profile route
 */
router.post(
  '/myProfile',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getProfile
)

/*
 * Update profile route
 */
router.post(
  '/editProfile',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  upload.single('file'),
  validateUpdateProfile,
  updateProfile
)

/*
 * Update AboutMe route
 */
router.post(
  '/updateAboutMe',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateAboutMe,
  updateProfile
)

/*
 * getting current location route
 */
router.put(
  '/currentLocation',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateLocation,
  currentLocation
)

/*
 * Get SideBar Details route
 */
router.post(
  '/sideBarDetails',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  sideBarDetails
)

/*
 * Change password route
 */
router.post(
  '/changePassword',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateChangePassword,
  changePassword
)

/*
 * Search Bar to get users route
 */
router.post('/searchUser',
             requireAuth,
             roleAuthorization(['user', 'admin']),
             trimRequest.all,
             validateSearchBar,
             searchUser)

/*
 * follow route
 */
router.put(
              '/follow',
              requireAuth,
              roleAuthorization(['user', 'admin']),
              trimRequest.all,
              validateFollowID,
              follow
            )

/*
 * unfollow route
 */
router.put(
  '/unfollow',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUnfollowID,
  unfollow
)

/*
 * remove follower from followers list route
 */
router.put(
  '/removeFollower',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  removeFollower
)

/*
 * List of followers and following for requestedProfile route
 */
router.post(
  '/listFollowersFollowing',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  follower_following_list
)

/*
 * Logout route
 */
router.get('/logout',requireAuth,roleAuthorization(['user', 'admin']),logout);

/*
 * SuggestedUsers route
 */
router.get(
  '/SuggestedUsers',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  SuggestedUsers
)

module.exports = router