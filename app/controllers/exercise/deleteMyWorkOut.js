const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const CreateMyWorkOutProgram = require('../../models/createMyWorkoutProgram')
const workOutDashboard = require('../../models/workOutDashboard')
const AddWorkoutInList = require('../../models/addWorkoutInList')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const deleteMyWorkOut = async (req, res) => { console.log(req.body.workOutProgrmID)
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }

    const id = await isIDGood(req.user._id)
    const workOutProgrmID = req.body.workOutProgrmID
    const reqType = req.body.reqType
    req = matchedData(req)
    if(reqType=="1"){  // delete my own workout Program 
                    await CreateMyWorkOutProgram.deleteOne({_id:workOutProgrmID}).then(()=>{
                      res.status(200).send({ status: 200, message: "successfully deleted my workoutProgram!!",})
                    }).catch(Err => {
                                    res.status(500).send({status: 500,message:Err.message || "Some error occurred while creating post."});
                                  }); 
  }

  else if(reqType=="2"){  // delete my own shared workout post 
                        await workOutDashboard.deleteOne({_id:workOutProgrmID}).then(()=>{
                          res.status(200).send({ status: 200, message: "successfully deleted shared myWorkoutProgram!!",})
                       }).catch(Err => {
                                        res.status(500).send({status: 500,message:Err.message || "Some error occurred while creating post."});
                                      }); 
  }

  else if(reqType=="3"){  // delete my add training workout 
    await AddWorkoutInList.deleteOne({_id:workOutProgrmID}).then(()=>{
      res.status(200).send({ status: 200, message: "successfully deleted my training!!",})
   }).catch(Err => {
                    res.status(500).send({status: 500,message:Err.message || "Some error occurred while creating post."});
                  }); 
 }
  } catch (error) {
                    console.log(error)
                    handleError(res, error)
                  }
 }

module.exports = {deleteMyWorkOut}