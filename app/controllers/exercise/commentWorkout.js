const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const workOutDashboard = require('../../models/workOutDashboard')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const commentWorkout = async (req, res) => {
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }
    const id = await isIDGood(req.user._id)
    
    const reqType = req.body.reqType
    const workOutProgrmID = req.body.workOutProgrmID
    const text =  req.body.text
    const commentPostedBy = id
    const comments = {text,commentPostedBy}

    const commentId = req.body.commentId

    const data = {_id:commentId}

    req = matchedData(req)

    if(reqType == "comment")
    {
     await workOutDashboard.findByIdAndUpdate({_id:workOutProgrmID},{$push:{comments:comments}},{new:true})
                           .populate("user likes comments.commentPostedBy addWorkout","name profile_info.profile_url")
                             .then((data)=>{
                                            res.status(200).send({ status: 200, message: "you have commented workoutProgram Post!!",data})
                                            }).catch(Err => {
                                                res.status(500).send({status: 500,
                                                                      message:Err.message || "Some error occurred while like post."
                                                                      });
                                                            });
    }
    else if(reqType == "uncomment")
    {

    await workOutDashboard.findOneAndUpdate({_id:workOutProgrmID},{$pull:{comments:data}},{new:true})
                          .populate("user likes comments.commentPostedBy addWorkout","name profile_info.profile_url")
                                  .then(()=>{
                                                 res.status(200).send({ status: 200, 
                                                                        message: "you have uncommented workoutProgram Post!!",})
                                                }).catch(Err => {
                                                                 res.status(500).send({status: 500,
                                                                                       message:Err.message || "Some error occurred while deleteing workout Post."
                                                                                       });
                                                                });

    }
                    
}catch (error) {
console.log(error)
handleError(res, error)
}
}

module.exports = {commentWorkout}