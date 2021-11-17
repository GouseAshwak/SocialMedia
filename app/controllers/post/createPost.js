const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const appConstants = require('../../../config/aws.config');
const User = require('../../models/user')
const Post = require('../../models/post')
var AWS = require("aws-sdk");

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


const createPost = async (req, res) => {
  try {
    const files = req.files
    const id = await isIDGood(req.user._id)
    const resultSet = await this.fetchUser_ID(id)
    req = matchedData(req)
    
    if(files.length != 0){ 
      
    //console.log("with media")
    
    const s3FileURL = appConstants.AWS_Uploaded_File_URL_LINK;

    var photos = [];

    for(var i=0;i<files.length;i++){

       var file = files[i];
      
       //Where you want to store your file

       var params = {
        Bucket: appConstants.AWS_BUCKET_NAME,
        Key: resultSet.name+'/'+file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
       };
       
       await this.uploadDocToS3(s3bucket,params,s3FileURL,file);
    
       photos.push(s3FileURL + params.Key);

}
    const postCategory = req.postCategory
    const Text = req.Text 
    const postType = req.postType
    const postedBy = id
    const post = await Post.create({
      Text,
      photos,
      postType,
      postedBy,
      postCategory
    })

    await post.populate("postedBy","name User_id email profile_info.profile_url")
    .then((details)=>{
      res.status(200).send({ status: 200, message: "successfully post has created!!",details})
   }).catch(Err => {
      res.status(500).send({
        status: 500,
        message:
          Err.message || "Some error occurred while creating post."
      });
   });
    
}
   else if(files.length === 0) { 
    
    //console.log("no media")
    const Text = {Description:req.Text,backgroundColor:req.backgroundColor,align:req.align}
    const postCategory = req.postCategory
    const postType = req.postType
    const postedBy = id
    const post = await Post.create({
      Text,
      postType,
      postedBy,
      postCategory
    })
   await post.populate("postedBy","name User_id email profile_info.profile_url")
    .then((details)=>{
      res.status(200).send({ status: 200, message: "successfully post has created!!",details});
   })
   .catch(Err => {
      res.status(500).send({
        status: 500,
        message:
          Err.message || "Some error occurred while creating post."
      });
   });
       
  } } catch (error) {
    console.log(error)
    handleError(res, error)
  }
}

module.exports = {createPost}
