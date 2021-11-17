const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const commentPost = async (req, res) => {
    try{
        if(req.body.postId.length == 0 ||req.body.text.length == 0)
            {res.status(400).send({status:400, message:"postId or comment field cannot be empty!!"})
            return;
            }
         const id = await isIDGood(req.body.postId)

         const comment = {
            text:req.body.text,
            commentPostedBy:req.user._id
         }
          //console.log(comment)
    
         Post.findByIdAndUpdate({_id:id},{$push:{comments:comment}},{new:true})
         .select("comments")
         .populate("comments.commentPostedBy","name User_id profile_info.profile_url")
         .sort('-createdAt')
         .then((data)=>{
          res.status(200).send({ status: 200, message: "Succesfully Comment posted!!",data})
         }).catch(Err => {
         res.status(500).send({status: 500,message:Err.message || "Some error occurred while following."});
         });
         }catch (error) {
         handleError(res, error)
         }
}
module.exports = {commentPost}