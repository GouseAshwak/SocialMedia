const { isIDGood, handleError } = require('../../middleware/utils')
const Post = require('../../models/post')
const asyncForEach = require('async-await-foreach') 

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * 
 * @param {Object} res - response object
 */

//newFeedPost
  exports.newFeedPost = async () => {
    var cursor;
    await Post.find({postType:'NewsFeed'})
    .select("Text photos postCategory postType updatedAt likes comments views")
    .populate("postedBy","name profile_info.profile_url is_following  followers")
    .populate("likes","name User_id profile_info.profile_url")
    .populate("views","name User_id profile_info.profile_url")
    .populate("comments.commentPostedBy","name User_id profile_info.profile_url")
    .populate("comments.commentLikedBy","name User_id profile_info.profile_url")
    .sort('-createdAt')
    // .limit(5)
    // .skip((7-1)*5)
    .then(data => {
      cursor = data;
    })
      .catch(err => {
        cursor = null;
      });
    return cursor;
  };

const allPost = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id);
    if(id != null){
    
    const newfeedPost = await this.newFeedPost()

    await asyncForEach(newfeedPost, async (obj) => {

      if(obj.postedBy._id != String(id))
      {  
          // console.log(obj.postedBy.id,id)
          if(obj.postedBy.followers.some(obj2 => obj2.myFollower == String(id))){
            obj.postedBy.is_following = true;
          }
      }
         // console.log(obj.postedBy.is_following)
    })
    
    const allPostDetails = newfeedPost

    res.status(200).send({ status: 200, message: "successfully fetched allposts details!!",allPostDetails});
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { allPost }