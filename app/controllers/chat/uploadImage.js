const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const appConstants = require('../../../config/aws.config');
var AWS = require("aws-sdk");
const Message = require('../../models/message');
const User = require('../../models/user')
const asyncForEach = require('async-await-foreach') 

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

// AWS S3 configuration
var s3bucket = new AWS.S3({
  accessKeyId: appConstants.AWS_ACCESS_KEY_ID,
  secretAccessKey: appConstants.AWS_SECRET_ACCESS_KEY,
  region: appConstants.AWS_REGION
});

 //checkUser-ID
 exports.fetchUser_ID = async (obj_id) => {
   var cursor;
   await User.findOne({ _id: obj_id }).then(data => {
     cursor = data;
   })
     .catch(err => {
       cursor = null;
     });
   return cursor;
 };

 //upload document to S3
 exports.uploadDocToS3 = async (s3bucket,params,s3FileURL,file) =>{

   var isUploaded;
   await s3bucket.upload(params, function(err, data) {
    if (err) {
      console.log(err);
      isUploaded = null;
      return isUploaded;
    } else {
      //res.send({ data });
      isUploaded = s3FileURL + params.Key+ file.originalname;
      
      return isUploaded;
    }
  });

};


const uploadImage = async (req, res) => { //console.log(req.body)
  try {
    const files = req.files;
    let conversationId = req.body.conversationId;
    let user = req.body.user;
    let chatType = req.body.chatType;
    let forwardMessage = req.body.forwardMessage;
    let replyMessageToId = req.body.replyMessageToId;
    let text = req.body.text;
    let new_Messsage;
    const id = await isIDGood(req.body.user)

    const resultSet = await this.fetchUser_ID(req.body.user)
    req = matchedData(req)
    
    if(files.length != 0){ 
      
    //console.log("with media")
    
    const s3FileURL = appConstants.AWS_Uploaded_File_URL_LINK;

    var photos = [];

     await asyncForEach(files, async (file) => {

       var file = file;
    
       //Where you want to store your file
       var params = {
        Bucket: appConstants.AWS_BUCKET_NAME,
        Key: resultSet.name+'/chat/'+file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
       };

       await this.uploadDocToS3(s3bucket,params,s3FileURL,file);
    
       photos.push(s3FileURL + params.Key);
     })
    if(chatType == 'Media'){console.log({conversationId,user,chatType,text,photos,forwardMessage,replyMessageToId});
        if(replyMessageToId.length !=0){
            new_Messsage = await Message.create({conversationId,user,chatType,text,photos,forwardMessage,replyMessageToId})
                          await new_Messsage.populate("user","name User_id")                
                          .populate({path:"replyMessageToId",select:'text',populate:{path:'user',model:'User', select:'name User_id'}}).execPopulate()
                          .then((newMesssage)=>{
                            res.status(200).send({ status: 200, message: "successfully upload image has done!!",newMesssage})
                            }).catch(Err => {
                            res.status(500).send({status: 500,message: Err.message || "Some error occurred while uploading image."
                            });
                            });
        }
        else if(replyMessageToId.length == 0){
            new_Messsage = await Message.create({conversationId,user,chatType,text,photos,forwardMessage})
                          await new_Messsage.populate("user","name User_id")
                          .then((newMesssage)=>{
                          res.status(200).send({ status: 200, message: "successfully upload image has done!!",newMesssage})
                          }).catch(Err => {
                          res.status(500).send({status: 500,message:Err.message || "Some error occurred while uploading image."});
                          });
            }
    }
} } catch (error) {
    console.log(error)
    handleError(res, error)
  }
}

module.exports = {uploadImage}
