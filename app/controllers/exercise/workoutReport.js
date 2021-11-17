const { isIDGood, handleError } = require('../../middleware/utils')
const workoutProgress = require('../../models/workoutProgress')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const workoutReport = async (req, res) => {
  try {

    // if(req.body.categorie.length == 0 || req.body.subCategorie.length == 0|| req.body.exerciseName.length == 0)
    // {
    //   res.status(400).send({status:400, message:"categorie, subCategorie and exerciseName cannot be empty!!"})
    //   return;
    // }
    const id = await isIDGood(req.user._id)
    const today = new Date();
    const month = today.getMonth()+1;     // 10 (Month is 0-based, so 10 means 11th Month)
    const year = today.getFullYear();
    const currentYearMonth = (year+"-"+month);

    await workoutProgress.aggregate([
                                    { $match: { user : id }},
                                    {$project:{workOutProgramID:1,
                                               warmUp:1,exercise:1,reps:1,kg:1,totalTime:1,note:1,photos:1,createdAt:1,
                                               year_Month: {$substr: [ "$createdAt",0,7] } }}
                                   ])
                                  .then((filterdata)=>{
                                    let data = filterdata.filter( ({ year_Month }) => year_Month === currentYearMonth );
                                   console.log(data)
                                //    let data = filterdata
                                                 res.status(200).send({ status: 200, message: "Succesfully retrieved ",data})
                                                }).catch(Err => {
                                                res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving work post."});
                                                        });

                  
}catch (error) {
console.log(error)
handleError(res, error)
}
}

module.exports = {workoutReport}