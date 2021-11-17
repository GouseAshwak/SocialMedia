const { isIDGood, handleError } = require('../../middleware/utils')
const workoutProgress = require('../../models/workoutProgress')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const mostWorkoutReport = async (req, res) => {
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }
    const id = await isIDGood(req.user._id)
  
    await workoutProgress.find({user:id}).sort({_id:-1}).limit(7)
                                  .then((filterdata)=>{
                                   let data = filterdata.reverse()
                                                 res.status(200).send({ status: 200, message: "Succesfully retrieved ",data})
                                                }).catch(Err => {
                                                res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving workout report."});
                                                        });

                  
}catch (error) {
console.log(error)
handleError(res, error)
}
}

module.exports = {mostWorkoutReport}