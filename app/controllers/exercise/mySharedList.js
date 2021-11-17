const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const workOutDashboard = require('../../models/workOutDashboard')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const mySharedList = async (req, res) => {
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }

    const id = await isIDGood(req.user._id)

    console.log(id)

    const workoutPostType= req.body.workoutPostType;

    req = matchedData(req)

    // console.log(id,workoutPostType)
  
// await workOutDashboard.aggregate([
//     { $match: { user:id} },
//     { $match: { workoutType:workoutPostType} },
//     { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
//     { "$unwind": "$user" },
//     { $project : { _id: 1, "user.User_id" : 1 , 
//                            "user._id":1,
//                            "user.name":1,
//                            "user.profile_info.profile_url" : 1 ,
//                            "giveNameOfYourProgram":1,
//                            "selectWeekdaysOfWorkout":1,
//                            "setExercise":1,"writeSomethingHere":1, 
//                            "workoutType":1} },
//     { $lookup: { from: 'workoutpostlikesunlikes', localField: '_id', foreignField: 'workOutProgrmID', as: 'likes' } },
//     { $lookup: { from: 'workoutpostcomments', localField: '_id', foreignField: 'workOutProgrmID', as: 'comments' } },
//     { $lookup: { from: 'addmyworkoutmembers', localField: '_id', foreignField: 'workOutProgrmID', as: 'addWorkout' } }
// ]).sort({ "addWorkout": -1 })
//                                 .then((data)=>{
//                                                res.status(200).send({ status: 200, message: "Succesfully retrieved "+workoutPostType+"type post !!",data})
//                                               }).catch(Err => {
//                                               res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving"+workoutPostType+" type post."});
//                                                       });

await workOutDashboard.find({ user:id,workoutType:workoutPostType})
                          .populate("user likes comments.commentPostedBy addWorkout","name profile_info.profile_url")
                          .sort({"myWorkoutAddedBy":-1})
                          .then((data)=>{
                                                 res.status(200).send({ status: 200, message: "Succesfully retrieved "+workoutPostType+"type post !!",data})
                                                }).catch(Err => {
                                                res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving"+workoutPostType+" type post."});
                                                        });

                                } catch (error) {
                                    console.log(error)
                                    handleError(res, error)
                                  }
                                }

module.exports = {mySharedList}