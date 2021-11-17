/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req = {},otpValue='',getExpiryTime='') => {
  return new Promise((resolve) => {
    let user = {
      _id: req._id,
      name: req.name,
      email: req.email,
      password:req.password,
      otp: otpValue,
      expiry_time:getExpiryTime,
      role: req.role,
      verified: req.verified
    }
    // Adds verification for testing purposes
    /*if (appInfo.NODE_ENV !== 'production') {
      user = {
        ...user,
        verification: req.verification
      }
    }*/
    resolve(user)
  })
}

module.exports = { setUserInfo }
