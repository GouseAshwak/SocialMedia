const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const CreateMyWorkOutProgram = require('../../models/createMyWorkoutProgram')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Myworkoutlist = async (req, res) => {
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }

    const id = await isIDGood(req.user._id)

    console.log(id)

    req = matchedData(req)
         
    await CreateMyWorkOutProgram.find({user:id}).then((data)=>{
      res.status(200).send({ status: 200, message: "successfully fetched my Myworkoutlist!!",data})
   }).catch(Err => {
      res.status(500).send({
        status: 500,
        message:
          Err.message || "Some error occurred while fetching Myworkoutlist."
      });
   });  

                                } catch (error) {
                                    console.log(error)
                                    handleError(res, error)
                                  }
                                }

module.exports = {Myworkoutlist}