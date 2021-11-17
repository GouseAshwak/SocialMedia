const { isIDGood, handleError } = require('../../middleware/utils')
const User = require('../../models/user')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

/*
 * unfollow user controller
 */
const unfollow = async (req, res) => {
  try {

       const id = await isIDGood(req.user._id)
       const unfollowId = await isIDGood(req.body.unfollowId)

       const data = {
        imFollowing:unfollowId
       }

       const data1 = {
        myFollower:id,
       }
       
       User.findByIdAndUpdate({_id:unfollowId},{$pull:{followers:data1}},{new:true},

       (Err,details)=>{if(Err){
           
        return res.status(400).send(
            {
            status:400,
            message:Err.message || "Some error occurred while doing unfollow."})
            }

            //console.log(details.name)
    
       User.findByIdAndUpdate({_id:id},{$pull:{following:data}},{new:true}).exec()

       .then(()=>{
        res.status(200).send({ status: 200, message: "you has unfollowed!!"})
      }).catch(Err => {
        res.status(500).send({
          status: 500,
          message:
            Err.message || "Some error occurred while unfollow."
        });
      });

        }
        )
    } catch (error) {
        handleError(res, error)
      }
}

module.exports = { unfollow }