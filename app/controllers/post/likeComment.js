const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const likeComment = async (req, res) => {
    try{
        if(req.body.postId.length == 0)
            {res.status(400).send({status:400, message:"postId field cannot be empty!!"})
            return;
            }
         const postId = await isIDGood(req.body.postId)

         const commentId = await isIDGood(req.body.commentId)

         //const comment = {commentLikedBy:req.user._id}

         //console.log(comment)

         await Post.findOneAndUpdate({_id:postId},
         {$push:{'comments.$[outer].commentLikedBy':req.user._id}},
         {"arrayFilters":[{"outer._id": commentId}], new: true})
         .select("comments")
         .populate("comments.commentPostedBy comments.commentLikedBy","name User_id profile_info.profile_url")
         //.sort('-createdAt')
         .then((data)=>{
            const comments =data
          res.status(200).send({ status: 200, message: "you have liked post succesfully!!",comments})
         }).catch(Err => {
         res.status(500).send({status: 500,message:Err.message || "Some error occurred while following."});
          });
         }catch (error) {
         handleError(res, error)
         }
}
module.exports = {likeComment}