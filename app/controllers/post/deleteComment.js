const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const deleteComment = async (req, res) => {
    try{
        if(req.body.commentId.length == 0)
            {res.status(400).send({status:400, message:"commentId field cannot be empty!!"})
            return;
            }

         const commentId = await isIDGood(req.body.commentId)

         const postId = await isIDGood(req.body.postId)

         const data = {_id:commentId}

         await Post.findByIdAndUpdate({_id:postId},{$pull:{comments:data}},{new:true})
         .then((data)=>{
          res.status(200).send({ status: 200, message: "Comment succesfully removed!!"})
         }).catch(Err => {
         res.status(500).send({status: 500,message:Err.message || "Some error occurred while following."});
         });
         }catch (error) {
         handleError(res, error)
         }
}
module.exports = {deleteComment}