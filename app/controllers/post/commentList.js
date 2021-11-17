const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

//newFeedPost
  exports.newFeedPost = async (obj_id) => {
    var cursor;
    await Post.find({$and:[{_id:obj_id},{postType:'NewsFeed'}]})
    .select("comments")
    .populate("comments.commentPostedBy","name User_id profile_info.profile_url")
    .populate("comments.commentLikedBy","name User_id profile_info.profile_url")
    .sort('-createdAt').then(data => {
      cursor = data;
    })
      .catch(err => {
        cursor = null;
      });
    return cursor;
  };

const commentList = async (req, res) => {
  try {
    if(req.body.postId == null ){
      res.status(400).send({status:400, message:"postId cannot be empty!!"})
      return;}
    const id = await isIDGood(req.user._id)
    const data = await this.newFeedPost(req.body.postId)
    const comments = data[0].comments
    if(comments.length !==0)
    {res.status(200).send({ status: 200, message: "Successfully fetched list of comments!!",comments});}
    else if(comments.length == 0)
    {res.status(200).send({ status: 200, message: "no coments!!",comments});}
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { commentList }