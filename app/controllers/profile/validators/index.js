const { validateChangePassword } = require('./validateChangePassword')
const { validateUpdateProfile } = require('./validateUpdateProfile')
const { validateAboutMe } = require('./validateAboutMe')
const { validateLocation } = require('./validateLocation')
const { validateSearchBar } = require('./validateSearchBar')
const { validateFollowID } = require('./validateFollowID')
const { validateUnfollowID } = require('./validateUnfollowID')

module.exports = {
  validateChangePassword,
  validateUpdateProfile,
  validateAboutMe,
  validateLocation,
  validateSearchBar,
  validateFollowID,
  validateUnfollowID
}