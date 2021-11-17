const { changePassword } = require('./changePassword')
const { getProfile } = require('./getProfile')
const { updateProfile } = require('./updateProfile')
const { sideBarDetails } = require('./sideBarDetails')
const { currentLocation } = require('./currentLocation')
const { searchUser } = require('./searchUser')
const { follow } = require('./follow')
const { unfollow } = require('./unfollow')
const {follower_following_list} = require('./follower_following_list')
const {removeFollower} = require('./removeFollower')
const {logout} = require('./logout')
const {SuggestedUsers} = require('./SuggestedUsers')

module.exports = {
  changePassword,
  getProfile,
  updateProfile,
  sideBarDetails,
  currentLocation,
  searchUser,
  follow,
  unfollow,
  removeFollower,
  follower_following_list,
  SuggestedUsers,
  logout
}
