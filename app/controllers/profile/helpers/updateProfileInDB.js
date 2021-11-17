const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
const updateProfileInDB = (req = {}, id = '') => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      id,
      { $set: { profile_info: req, is_profileSetup: true }},
      {
        new: true,
        runValidators: true,
        select: '_id name User_id profile_info'
      },
      async (err, user) => {
        try {
          await itemNotFound(err, user, 'NOT_FOUND')
          resolve({
            status: 200,
            message:"Successfully updated profile!!",
            User_Details:user,
            }
            )
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { updateProfileInDB }
