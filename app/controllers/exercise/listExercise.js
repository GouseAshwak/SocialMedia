const { handleError } = require('../../middleware/utils');
const exerciseList = require('../../models/exerciseList')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * 
 * @param {Object} res - response object
 */

const listExercise = async (req, res) => {
  try {

    if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    {res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
     return;
    }

    const categorie = req.body.categorie;

    const subCategorie =  req.body.subCategorie;

    const exerciseName = req.body.exerciseName;

   // to get all excerises of one particular exercise module
        
        await exerciseList.find({$and: [{categorie: categorie},{subCategorie:subCategorie}]})
                          .then((exercise_List)=>{
                          res.status(200).send({ status: 200, message: "successfully retrieved all excerises of one particular exerciseType module!!",exercise_List});})
                          .catch(Err => {
                          res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving exerciseList."});
                          });


  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { listExercise }