const { getProfileFromDB } = require('./helpers')
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
  await Post.find({$and:[{postedBy:obj_id},{postType:'NewsFeed'}]})
  .then(data => {
    cursor = data.length;
  })
    .catch(err => {
      cursor = null;
    });
  return cursor;
};

const getProfile = async (req, res) => {
  try {
      
    if(req.body.profileId == null ){

      res.status(400).send({status:400, message:"profileId cannot be empty!!"})
      return;
    }
    const id = await isIDGood(req.user._id)
    const data = await getProfileFromDB(req.body.profileId)
    const newfeedPost_totalCount = await this.newFeedPost(req.body.profileId)
    if(req.user._id != req.body.profileId){

       function isMatched1(value) { //To check weather My profile Id present in their follower list
         var isMatch;
       if(String(value.myFollower) === String(req.user._id)){
          isMatch=true;
          //console.log(isMatch);
       }
          return isMatch;
      }

      function isMatched2(value) { //To check weather My profile Id present in their following list
        var isMatch;
      if(String(value.imFollowing) === String(req.user._id)){
         isMatch=true;
         //console.log(isMatch);
      }
         return isMatch;
     }

      let result1 = await data.user.followers.filter(isMatched1);
      let result2 = await data.user.following.filter(isMatched2);
      
      if(result1.length !=0){
        data.user.is_followed = true;
      }
      else{
        data.user.is_followed = false;
      }
      if(result2.length !=0){
        data.user.is_following = true;
      }else{
        data.user.is_following = false;
      }
      //console.log("is_following: "+data.user.is_following+", is_followed: "+data.user.is_followed)
    }
    const user_Id=data.user.User_id;
    const user_Name=data.user.name;
    const profile_info=data.user.profile_info;
    const About_Me=data.user.About_Me;
    const is_following=data.user.is_following;
    const is_followed=data.user.is_followed;
    const followers=data.user.followers.length;
    const following= data.user.following.length;
    res.status(200).send({status:200,
                          message:"Successfully fetched myProfile!!",
                          user_Id,
                          user_Name,
                          profile_info,
                          About_Me,
                          is_following,
                          is_followed,
                          followers,
                          following,
                          newfeedPost_totalCount});
  } catch (error) { 
    handleError(res, error)
  }
}

module.exports = { getProfile }
