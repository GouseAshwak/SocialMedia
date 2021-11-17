const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { updateProfileInDB } = require('./helpers')
const appConstants = require('../../../config/aws.config');
const User = require('../../models/user')
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


const updateProfile = async (req, res) => {
  try {
    const file = req.file
    const checkReqType = req.body.reqType
    
    const id = await isIDGood(req.user._id)
    const resultSet = await this.fetchUser_ID(id)
    req = matchedData(req)
    
    if(checkReqType === "create&editProfile"){

    const s3FileURL = appConstants.AWS_Uploaded_File_URL_LINK;
    
    //Where you want to store your file
    var params = {
        Bucket: appConstants.AWS_BUCKET_NAME,
        Key: resultSet.name+'/'+file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
       };
    await this.uploadDocToS3(s3bucket,params,s3FileURL,file);

    var profile = {
      Gender:req.Gender,
      Date_of_Brith:req.Date_of_Brith,
      Height:req.Height,
      HeightUnit:req.HeightUnit,
      Weight: req.Weight,
      WeightUnit: req.WeightUnit,
      profile_url : s3FileURL + params.Key
    };
    
   res.status(200).json(await updateProfileInDB(profile, id))}
   else if(checkReqType ==='updateAboutMe'){
    const About_Me = req.About_Me;
    const resultSet = await this.fetchUser_ID(id)
       if (resultSet != null) {
      User.findOneAndUpdate({_id:resultSet._id}, { $set: { About_Me: About_Me } }).exec()
     .then((resultSet) => {
       const aboutMe = resultSet.About_Me
       res.status(200).send({ status: 200, message: "About_Me has been updated successfully!!",aboutMe});
     })
    .catch(Err => {
       res.status(500).send({
         status: 500,
         message:
           Err.message || "Some error occurred while addding About_Me."
       });
     });
    }
  }} catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateProfile }
