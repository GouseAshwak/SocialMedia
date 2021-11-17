const { isIDGood, handleError } = require('../../middleware/utils')
const User = require('../../models/user')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

/*
 * follow user controller
 */
const follow = async (req, res) => {
  try {

       const id = await isIDGood(req.user._id)
       const followId = await isIDGood(req.body.followId)

       if(String(req.user._id) === String(req.body.followId)){
       return res.status(400).send({status:400,message:"User can't follow himself!"})
      }

       const data = {
        imFollowing:followId
       }

       const data1 = {
        myFollower:id
       }
       
       User.findByIdAndUpdate({_id:followId},{$push:{followers:data1}},{new:true},

       (Err,details)=>{if(Err){
           
        return res.status(400).send(
            {
            status:400,
            message:Err.message || "Some error occurred while addding follower."
            }
            )}
    
       User.findByIdAndUpdate({_id:id},{$push:{following:data}},{new:true})

       .then((followDetails)=>{
        res.status(200).send({ status: 200, message: "you are following!!",followDetails})
      }).catch(Err => {
        res.status(500).send({
          status: 500,
          message:
            Err.message || "Some error occurred while following."
        });
      });

        }
        )
    } catch (error) {
        handleError(res, error)
      }
}

module.exports = { follow }