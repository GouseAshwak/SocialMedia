const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const AddWorkoutInList = require('../../models/addWorkoutInList')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const myTraininigList = async (req, res) => {
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }
    const id = await isIDGood(req.user._id)
    const workoutPostType = req.body.workoutPostType
    const user = req.body.user

    // console.log(id,workoutPostType)

    req = matchedData(req)
   
//    await AddWorkoutInList.find({$add:[{user:user},{workoutType:workoutPostType}]})
await AddWorkoutInList.find({user:id,workoutType:workoutPostType})
                                  .then((data)=>{
                                                 res.status(200).send({ status: 200, message: "Succesfully retrieved "+workoutPostType+"type post !!",data})
                                                }).catch(Err => {
                                                res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving"+workoutPostType+" type post."});
                                                        });

                  
}catch (error) {
console.log(error)
handleError(res, error)
}
}

module.exports = {myTraininigList}