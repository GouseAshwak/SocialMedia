const User = require('../../models/user')

const { generateToken } = require('../../controllers/auth/helpers/generateToken')

const bcrypt = require('bcryptjs')

const validator = require('validator');
const { hi } = require('date-fns/locale');

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

 exports.checkEmailId = async (emailId) =>{

  // Validate request
  if (!emailId) {
    return null;
  }
  var cursor;

  await User.findOne({email:emailId}).then(data => {
    cursor = data;
  })
  .catch(err => {
    cursor=null;
  });
  return cursor;
};

const setNewPassword = async (req, res) => {
    // Validate request
   if (!req.body.password || !req.body.email) {
    res.status(400).send({ message: "Username or email must not be empty!" });
    return;
    }
      
    const resultSet = await this.checkEmailId(req.body.email);
    //updated password hashing before stroing in Database
    const saltRounds = 5;
    var password = req.body.password;
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
                        
          if(resultSet){
          User.findOneAndUpdate({email:resultSet.email},{$set:{password:hash}}).exec()
          .then((resultSet) => {
          res.status(200).send(
            {
              status:200,
              message:"Your password has been updated successfully!!",
              _id:resultSet._id,
              User_ID:resultSet.User_id,
              User_verified:resultSet.is_verified,
              is_profileSetup:resultSet.is_profileSetup,
              User_Token:generateToken(resultSet.id)
            });
          })
          .catch(Err => {
          res.status(500).send({
          status:500,
          message:
          Err.message || "Some error occurred while setting a new password."
          });
          });
          }else{
          res.status(500).send({
          status:500,
          message:
          "Invalid Request not yet registered with oneCC"
          });
          }


          });
          });   
    }

module.exports = { setNewPassword }
