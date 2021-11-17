const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

/*
 * like or unlike Post controller
 */
const likeOrUnlikePost = async (req, res) => {
  try {
       
       if(req.body.postId.length == 0 && req.body.reqType == ""){
          res.status(400).send({status:400, message:"postId field cannot be empty!!"})
          return;
        }
       const id = await isIDGood(req.body.postId)

       if (req.body.reqType == 'like') {
        await  Post.findByIdAndUpdate({_id:id},{$push:{likes:req.user._id}},{new:true})
           .select("likes")
           .populate("likes","name User_id email profile_info.profile_url")
           .sort('-createdAt')
           .then((data)=>{
        res.status(200).send({ status: 200, message: "you liked post!!",data})
      }).catch(Err => {
        res.status(500).send({status: 500,message:Err.message || "Some error occurred while following."});
      });
      }else if (req.body.reqType == 'unlike') {
        Post.findByIdAndUpdate({_id:id},{$pull:{likes:req.user._id}},{new:true})
        .then(()=>{res.status(200).send({ status: 200, message: "you unliked post!!"})
        }).catch(Err => {
         res.status(500).send({status: 500,message:Err.message || "Some error occurred while following."});
   });
    }
} catch (error) {
        handleError(res, error)
      }
}

module.exports = { likeOrUnlikePost }