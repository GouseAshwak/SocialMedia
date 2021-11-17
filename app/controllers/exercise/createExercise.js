const { handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const appConstants = require('../../../config/aws.config');
const exerciseList = require('../../models/exerciseList')
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


const createExercise = async (req, res) => {
  try {

    if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    {
      res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
      return;
    }

    var file = req.files ;

    const Preparation = req.body.Preparation;
    const Execution = req.body.Execution;
    const categorie = req.body.categorie;
    const subCategorie = req.body.subCategorie;
    const exerciseName = req.body.exerciseName;
    const instructions = {Preparation,Execution};
    const primaryMuscle = req.body.primaryMuscle;
    const secondaryMuscle = req.body.secondaryMuscle;
    const type =req.body.type;

    req = matchedData(req)
     
    //console.log("with media")
    
    const s3FileURL = appConstants.AWS_Uploaded_File_URL_LINK;

    var excerciseImage = [];
      
    //Where you want to store your file

    var params = {
    Bucket: appConstants.AWS_BUCKET_NAME,
    Key: '1CC/exercise/'+file[0].originalname,
    Body: file[0].buffer,
    ContentType: file[0].mimetype,
    ACL: "public-read"
    };

    await this.uploadDocToS3(s3bucket,params,s3FileURL,file);

    excerciseImage.push(s3FileURL + params.Key);
    
    await exerciseList.create({
      categorie,
      subCategorie,
      exerciseName,
      instructions,
      primaryMuscle,
      secondaryMuscle,
      type,
      excerciseImage
    }).then(()=>{
      res.status(200).send({ status: 200, message: "successfully exercise data has added!!"})
   }).catch(Err => {
      res.status(500).send({
        status: 500,
        message:
          Err.message || "Some error occurred while creating post."
      });
   });
  
  

                                } catch (error) {
                                    console.log(error)
                                    handleError(res, error)
                                  }
                                }

module.exports = {createExercise}