const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getProfileFromDB = async(id = '') => {
  return new Promise((resolve, reject) => {
    User.findById(
      id,
      '-role -_id -updatedAt -createdAt -lat -long -is_verified -email -otp -expiry_time -verification',
      async (err, user) => {
      try {
        await itemNotFound(err, user, 'NOT_FOUND')
        resolve({
          //status: 200,
          //message:"Successfully fetched myProfile!!",
          user}
          /*user_Id:user.User_id,
          user_Name:user.name,
          profile_info:user.profile_info,
          About_Me:user.About_Me,
          followers:user.followers.length,
          following:user.following.length} */
      )} catch (error) {
        reject(error)
      }
    })
  })
}
module.exports = { getProfileFromDB }
