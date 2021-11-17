const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const workOutDashboard = require('../../models/workOutDashboard')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const shareWorkoutPost = async (req, res) => { console.log(req.body.giveNameOfYourProgram)
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }

    const id = await isIDGood(req.body.user)
    const giveNameOfYourProgram =req.body.giveNameOfYourProgram
    const selectWeekdaysOfWorkout = req.body.selectWeekdaysOfWorkout
    const setExercise = req.body.setExercise
    const workoutType = req.body.workoutType
    const writeSomethingHere = req.body.writeSomethingHere

    req = matchedData(req)
         
    const data =  await workOutDashboard.create({
            user:id,
            giveNameOfYourProgram,
            selectWeekdaysOfWorkout,
            setExercise,
            workoutType,
            writeSomethingHere
        })
    await data.populate("user","name User_id profile_info.profile_url").then((data)=>{
      res.status(200).send({ status: 200, message: "successfully myWorkoutProgram has shared!!",data})
   }).catch(Err => {
      res.status(500).send({status: 500,message:Err.message || "Some error occurred while sharing myWorkoutProgram."});
   }); 
                                } catch (error) {
                                    console.log(error)
                                    handleError(res, error)
                                  }
                                }

module.exports = {shareWorkoutPost}