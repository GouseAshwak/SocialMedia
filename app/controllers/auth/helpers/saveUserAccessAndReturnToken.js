const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const User = require('../../../models/user')
const { generateToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */

// Check registered Email 
exports.checkEmailId = async (emailId) => {

  // Validate request
  if (!emailId) {
    return null;
  }
  var cursor;

  await User.findOne({ email: emailId }).then(data => {
    cursor = data;
  })
    .catch(err => {
      cursor = null;
    });
  return cursor;
};

const saveUserAccessAndReturnToken = (req = {}, user = {}) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    userAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const userInfo = await this.checkEmailId(user.email)
        resolve({
          token: generateToken(user._id),
          userInfo
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { saveUserAccessAndReturnToken }
