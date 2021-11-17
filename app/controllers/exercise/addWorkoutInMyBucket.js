const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const AddWorkoutInList = require('../../models/addWorkoutInList')
const workOutDashboard = require('../../models/workOutDashboard')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const addWorkoutInMyBucket = async (req, res) => { console.log(req.body.giveNameOfYourProgram)
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }

    const id = await isIDGood(req.user._id)
    const giveNameOfYourProgram =req.body.giveNameOfYourProgram
    const selectWeekdaysOfWorkout = req.body.selectWeekdaysOfWorkout
    const setExercise = req.body.setExercise
    const workoutType = req.body.workoutType
    let workOutProgrmID = req.body.workOutProgrmID
    let myWorkoutAddedBy = id

    req = matchedData(req)
         
   await AddWorkoutInList.create({user:id,giveNameOfYourProgram,selectWeekdaysOfWorkout,setExercise,workoutType},
        (Err,data)=>{if(Err){
           
            return res.status(400).send({
                status:400,
                message:Err.message || "Some error occurred while adding workout in your list!!"
                })
            }
            workOutDashboard.findByIdAndUpdate({_id:workOutProgrmID},{$push:{addWorkout:myWorkoutAddedBy}},{new:true})
                                .then((result)=>{
                                    res.status(200).send({ status: 200, message: "successfully added workout in AddWorkoutInList",data})
                                })
                                .catch(Err => { console.log(Err.message)
                                    res.status(500).send({
                                                        status: 500,
                                                        message:Err.message || "Some error occurred while adding work in your list."
                                                        });
                                    });
})
                                } catch (error) {
                                    console.log(error)
                                    handleError(res, error)
                                  }
                                }

module.exports = {addWorkoutInMyBucket}