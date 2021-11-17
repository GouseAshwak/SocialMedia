const { matchedData } = require('express-validator')
const User = require('../../models/user')
const request =require("request")

const {
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

//check registered Email Id or username
exports.checkEmailOrUsername = async (emailId) => {
  var cursorData;
  await User.findOne({$or:[{email:emailId},{User_id:emailId}]})
      .select("_id role name email password verification")
      .then((result) => {
          
          cursorData = result;
      }).catch(err => {
          cursorData=null;
      });
  return cursorData;
}

const login = async (req, res) => {

  try {
    const data = matchedData(req)
     
    const user = await this.checkEmailOrUsername(req.body.email)
    
    if(user !=null ){

    await checkLoginAttemptsAndBlockExpires(user)

    const isPasswordMatch = await checkPassword(req.body.password, user)

    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(user))
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0
      await saveLoginAttemptsToDB(user)
      let data = await saveUserAccessAndReturnToken(req, user)
      const token = data.token;
      const _id = data.userInfo._id;
      const user_id = data.userInfo.User_id;
      const user_Email = data.userInfo.email;
      const user_Verified = data.userInfo.is_verified;
      const is_profileSetup = data.userInfo.is_profileSetup;

      if(user_Verified == false){
      request({
        url: 'http://qa.1cc-world.com/1cc/api/setAgainOtp',
        method: 'POST',
        json: {
          email: user_Email,
          reqType: "signup"
        }
      }, function (error, response, body) {
        //console.log('error', error)
        //console.log('response', response)
        console.log('body', body)
      });
    }

      res.status(200).send({status:200,message:"Successfully Login!!",
      token,
      _id,
      user_id,
      user_Email,
      user_Verified,
    is_profileSetup});
    }
  }
  else{
    res.status(400).send({status:400,message:"Sorry we couldn't find an account with that Email/ User ID"})
  }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
