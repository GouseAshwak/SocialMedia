const { buildErrObject } = require('../../../middleware/utils')

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = (user = {}) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        return reject(buildErrObject(400, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}

module.exports = { saveLoginAttemptsToDB }
