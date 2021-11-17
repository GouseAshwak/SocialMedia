const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
//getPostandUpdate details
  exports.modifyPost = async (obj_id,updatePostType,updatePostCategory,UpdateText) => { console.log(obj_id,updatePostType,updatePostCategory,UpdateText)
   var cursor;
  await Post.findOneAndUpdate({_id:obj_id}, { PostType: updatePostType ,postCategory:updatePostCategory, Text:UpdateText},{new:true})
   .select("Text photos postCategory postType postedBy likes views comments")
   .populate("postedBy","name User_id email profile_info.profile_url")
   .populate("likes","name User_id profile_info.profile_url")
   .populate("views","name User_id profile_info.profile_url")
   .populate("comments.commentPostedBy","name User_id profile_info.profile_url")
   .populate("comments.commentLikedBy","name User_id profile_info.profile_url")
   .then((data)=> {
      cursor = data;
      console.log("data")
    })
      .catch(err => {
        console.log(err)
        cursor = null;
      });
    return cursor;  
  };

const postEdit = async (req, res) => {
  try {
     
    if(req.body.postId == null || req.body.Text == null || req.body.postType == null || req.body.postCategory == null){

      res.status(400).send({status:400, message:"all fields required cannot be empty!!"})
      return;
    }
    const id = await isIDGood(req.user._id)
    
    if(req.body.Text != null && req.body.backgroundColor != null && req.body.align != null){ console.log("..")
        const Text = {Description:req.body.Text,backgroundColor:req.body.backgroundColor,align:req.body.align}
        const postCategory = req.body.postCategory
        const postType = req.body.postType
        const _id = req.body.postId
        const details = await this.modifyPost(_id,postType,postCategory,Text)
        res.status(200).send({ status: 200, message: "Successfully post edited!!",details});
    }
    else if(req.body.Text != null && req.body.backgroundColor == null && req.body.align == null){ console.log("...")
        const Text = req.body.Text
        const postCategory = req.body.postCategory
        const postType = req.body.postType
        const _id = req.body.postId
        const details = await this.modifyPost(_id,postType,postCategory,Text)
        res.status(200).send({ status: 200, message: "Successfully post edited!!",details});
    }
    
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { postEdit }