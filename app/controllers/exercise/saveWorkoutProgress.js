const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const WorkoutProgress = require('../../models/workoutProgress')
const appConstants = require('../../../config/aws.config');
const User = require('../../models/user')
const asyncForEach = require('async-await-foreach') 
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

const saveWorkoutProgress = async (req, res) => { 
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }
    
    const files = req.files;
    const id = await isIDGood(req.user._id)
    const workOutProgramID =req.body.workOutProgramID
    const warmUp = req.body.warmUp
    const exercise = JSON.parse(req.body.exercise);console.log(exercise)
    const reps = req.body.reps
    const kg = req.body.kg
    const totalTime = req.body.totalTime
    const note = req.body.note
    const onModel = req.body.onModel

    if(files.length != 0){ 
      
        //console.log("with media")

        const resultSet = await this.fetchUser_ID(id);
        
        const s3FileURL = appConstants.AWS_Uploaded_File_URL_LINK;
    
        var photos = [];
    
         await asyncForEach(files, async (file) => {
    
           var file = file;
        
           //Where you want to store your file
           var params = {
            Bucket: appConstants.AWS_BUCKET_NAME,
            Key: resultSet.name+'/workoutProgressImage/'+file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
           };
    
           await this.uploadDocToS3(s3bucket,params,s3FileURL,file);
        
           photos.push(s3FileURL + params.Key);
         })

        }

    req = matchedData(req)
         
    await WorkoutProgress.create({
        user:id,
        workOutProgramID,
        warmUp,
        exercise:exercise,
        reps,
        kg,
        totalTime,
        note,
        photos,
        onModel
    }).then((data)=>{
      res.status(200).send({ status: 200, message: "successfully created myWorkProgram has added!!",data})
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

module.exports = {saveWorkoutProgress}