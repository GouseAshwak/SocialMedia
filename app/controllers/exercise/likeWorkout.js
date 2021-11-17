const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const workOutDashboard = require('../../models/workOutDashboard')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const likeWorkout = async (req, res) => { console.log(req.body.workOutProgrmID)
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }
    const id = await isIDGood(req.user._id)
    const workOutProgrmID = req.body.workOutProgrmID
    const reqType = req.body.reqType
    const workoutPostLikeBy = id

    req = matchedData(req)
    if(reqType == "like")
    {
     await workOutDashboard.findByIdAndUpdate({_id:workOutProgrmID},{$push:{likes:workoutPostLikeBy}},{new:true})
                                  .then((data)=>{
                                                 res.status(200).send({ status: 200, message: "you have liked workoutProgram Post!!",data})
                                                }).catch(Err => {
                                                res.status(500).send({status: 500,message:Err.message || "Some error occurred while like post."});
                                                        });
    }
    else if(reqType == "unlike")
    {
      await workOutDashboard.findByIdAndUpdate({_id:workOutProgrmID},{$pull:{likes:workoutPostLikeBy}},{new:true})
                                  .then((data)=>{
                                                 res.status(200).send({ status: 200, 
                                                                        message: "you have liked workoutProgram Post!!",data})
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

module.exports = {likeWorkout}