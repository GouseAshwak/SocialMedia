const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')
const appConstants = require('../../../config/aws.config');
var AWS = require("aws-sdk");


/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

// AWS S3 configuration
var s3bucket = new AWS.S3({
    accessKeyId: appConstants.AWS_ACCESS_KEY_ID,
    secretAccessKey: appConstants.AWS_SECRET_ACCESS_KEY,
    region: appConstants.AWS_REGION
  });

//fetch post by post_id
  exports.fetchPost = async (Postid) => {
   var cursor;
  await Post.find({_id:Postid})
   .then(data => {
      cursor = data;
    })
      .catch(err => {
        cursor = null;
      });
    return cursor;  
  };

//delete document from S3
exports.removeDocFromS3 = async (params) =>{
    var isDeleted;
  await  s3bucket.deleteObjects(params, function(err, data) {
    if (err) // error
    {
        console.log(err.stack);
        isDeleted = false;
        return isDeleted;
    }
    else // deleted
    {
        isDeleted = true
        //console.log(isDeleted)
        return isDeleted;
    }
   }).promise();
 };
 

const deletePost = async (req, res) => {
  try {
    let objects =[];
    let status;

    if(req.body.postId == null){
      res.status(400).send({status:400, message:"postId field cannot be empty!!"})
      return;
    }
    const id = await isIDGood(req.user._id)
    const details = await this.fetchPost(req.body.postId)
    if(details[0].postCategory == "ImageFeed" || details[0].postCategory == "VideoFeed"){ //excute if it is Media post
    for (i=0;i<details[0].photos.length;i++)
    {
    Key = details[0].photos[i].replace('https://d27ti6r66klpu0.cloudfront.net/', ""),
    objects.push({Key})
    }
    var params = {
        Bucket:appConstants.AWS_BUCKET_NAME ,
        Delete: {Objects: objects,Quiet: false}
    };
       status = await this.removeDocFromS3(params);
  }
     await Post.findByIdAndDelete(req.body.postId)
        .then(()=>{
        res.status(200).send({ status: 200, message: "successfully post has deleted!!",})
   }).catch(Err => {
      res.status(500).send({
        status: 500,
        message:
          Err.message || "Some error occurred while deleting post."
      }); 
    });
    }catch (error) {
    handleError(res, error)
  }
}

module.exports = { deletePost } 