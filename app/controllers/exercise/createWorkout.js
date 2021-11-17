const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const CreateMyWorkOutProgram = require('../../models/createMyWorkoutProgram')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const createWorkout = async (req, res) => { console.log(req.body.giveNameOfYourProgram)
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

    req = matchedData(req)
         
    await CreateMyWorkOutProgram.create({
        user:id,
        giveNameOfYourProgram,
        selectWeekdaysOfWorkout,
        setExercise,
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

module.exports = {createWorkout}