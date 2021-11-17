const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

//MyDairyPost
 exports.myDairyPost = async (obj_id) => {
    var cursor;
    await Post.find({$and:[{postedBy:obj_id},{postType:'MyDairy'}]})
    .select("Text photos postCategory postType likes views comments updatedAt")
    .populate("postedBy","name User_id email profile_info.profile_url")
    .populate("likes","name User_id profile_info.profile_url")
    .populate("views","name User_id profile_info.profile_url")
    .populate("comments.commentPostedBy","name User_id profile_info.profile_url")
    .populate("comments.commentLikedBy","name User_id profile_info.profile_url")
    .sort('-createdAt')
    .then(data => {
      cursor = data;
    })
      .catch(err => {
        cursor = null;
      });
    return cursor;
  };

//newFeedPost
  exports.newFeedPost = async (obj_id) => {
    var cursor;
    await Post.find({$and:[{postedBy:obj_id},{postType:'NewsFeed'}]})
    .select("Text photos postCategory postType likes views comments updatedAt")
    .populate("postedBy","name User_id email profile_info.profile_url")
    .populate("likes","name User_id profile_info.profile_url")
    .populate("views","name User_id profile_info.profile_url")
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

const myPost = async (req, res) => {
  try {

    if(req.body.postedBy == null ){

      res.status(400).send({status:400, message:"postedBy_Id cannot be empty!!"})
      return;
    }

    const id = await isIDGood(req.user._id)
    const mydairyPost = await this.myDairyPost(req.body.postedBy)
    const newfeedPost = await this.newFeedPost(req.body.postedBy)
    const newsfeed_totalPosts = newfeedPost.length
    if(req.body.postedBy == id)
    {
    const postDetails = {mydairyPost,newfeedPost,newsfeed_totalPosts}
    res.status(200).send({ status: 200, message: "Successfully fetched post details!!",postDetails});}

    else if(req.body.postedBy != id){
    const postDetails = {newfeedPost,newsfeed_totalPosts}
    res.status(200).send({ status: 200, message: "Successfully fetched post details!!",postDetails});
    }

  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { myPost }