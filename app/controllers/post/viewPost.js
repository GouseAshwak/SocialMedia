const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

/*
 * viewPost controller
 */
const viewPost = async (req, res) => {
  try {
       
       if(req.body.postId.length == 0){
          res.status(400).send({status:400, message:"postId field cannot be empty!!"})
          return;
        }
       const id = await isIDGood(req.body.postId)
       
       Post.findByIdAndUpdate({_id:id},{$push:{views:req.user._id}},{new:true})
           .select("views")
           .populate("views","name User_id email profile_info.profile_url")
           .sort('-createdAt')
           .then((data)=>{
        res.status(200).send({ status: 200, message: "Viewed video succesfully!!",data})
      }).catch(Err => {
        res.status(500).send({status: 500,message:Err.message || "Some error occurred while following."});
      });
      }catch (error) {
        handleError(res, error)
      }
}
module.exports={viewPost}