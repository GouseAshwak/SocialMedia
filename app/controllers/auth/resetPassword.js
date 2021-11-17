/*const { matchedData } = require('express-validator')
const {
  findForgotPassword,
  findUserToResetPassword,
  updatePassword,
  markResetPasswordAsUsed
} = require('./helpers')
const { handleError } = require('../../middleware/utils')*/

const User = require('../../models/user')

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

const resetPassword = async (req, res) => {
    /*const data = matchedData(req)
    const forgotPassword = await findForgotPassword(data.id)
    const user = await findUserToResetPassword(forgotPassword.email)
    await updatePassword(data.password, user)
    const result = await markResetPasswordAsUsed(req, forgotPassword)
    res.status(200).json(result)*/
    // Validate request
    if (!req.body.otp || !req.body.email || !req.body.reqType) {
    res.status(400).send({ message: "Username or email must not be empty!" });
    return;
    }
    
    const emailCheck = await this.checkEmailId(req.body.email);
    
    if(typeof emailCheck!==null && Date.now() <= emailCheck.expiry_time && emailCheck.otp === req.body.otp && req.body.reqType === 'recover'){
      res.status(200).send({status:200,message:"User has been verified successfully, Please set your new password!!!"});
    }
    else if(Date.now() >= emailCheck.expiry_time)
    {res
      .status(400)
      .send({status:400,
        message:"Otp has expired!."})
    }

    else
    {res
      .status(500)
      .send({status:500,
        message:"something gone wrong with the verification."})
    }

    if(typeof emailCheck!==null && !emailCheck.is_verified){

      if(Date.now() <= emailCheck.expiry_time && emailCheck.otp === req.body.otp ){
         
          User.updateOne({email:req.body.email},{$set:{is_verified:true}}).exec()
      .then((resultSet) => {
         res.status(200).send({status:200,message:"User has been verified successfully!!"});
      })
      .catch(Err => {
          res.status(500).send({
              status:500,
              message:
              Err.message || "Some error occurred while verifying the user."
            });
      });
      }else{
          res.status(500).send({status:500, message:"something gone wrong with the verification"});
      }
    }
  
    if(typeof emailCheck ==null){
      res.status(500).send({status:500, message:"something gone wrong with the verification"});
    }
  
  }

module.exports = { resetPassword }
