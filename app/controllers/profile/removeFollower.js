const { isIDGood, handleError } = require('../../middleware/utils')
const User = require('../../models/user')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

/*
 * removeFollowers controller
 */
const removeFollower = async (req, res) => {
  
    try {
        
        if(req.body.removeFollowerID == ""){
            res.status(400).send({status:400, message:"removeFollowerID cannot be empty!!"})
            return;}

       const id = await isIDGood(req.user._id)
       
       const removeFollower_id = await isIDGood(req.body.removeFollowerID)

       const data = {
        imFollowing:id
       }

       const data1 = {
        myFollower:removeFollower_id,
       }

       User.findByIdAndUpdate({_id:id},{$pull:{followers:data1}},{new:true},

       (Err,details)=>{if(Err){
           
        return res.status(400).send(
            {
            status:400,
            message:Err.message || "User doesn't exist to remove from the followers."})
            }
    
       User.findByIdAndUpdate({_id:removeFollower_id},{$pull:{following:data}},{new:true}).exec()

       .then(()=>{
        res.status(200).send({ status: 200, message: "succesfully removed follower!!"})
      }).catch(Err => {
        res.status(500).send({
          status: 500,
          message:
            Err.message || "Some error occurred while removeing follower."
        });
      });

        }
        )
    } catch (error) {
        handleError(res, error)
      }
}

module.exports = {removeFollower}