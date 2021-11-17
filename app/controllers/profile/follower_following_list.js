const { isIDGood, handleError } = require('../../middleware/utils')
const User = require('../../models/user')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

//checkUser-ID
exports.fetchUser_ID = async (obj_id) => {
 
    var cursor;
    await User.findOne({ _id: obj_id })
    .populate("following.imFollowing followers.myFollower","name User_id profile_info.profile_url is_following is_followed")
    .then(data => {
      cursor = data;
    })
      .catch(err => {
        cursor = null;
      });
    return cursor;
  };

//List for followers and following.
const follower_following_list = async (req, res) => {
    try {
        
      if(req.body.profileId == null && req.body.reqType== null){
  
        res.status(400).send({status:400, message:"profileId or reqType cannot be empty!!"})
        return;
      }
      const id = await isIDGood(req.user._id)
      const data = await this.fetchUser_ID(req.body.profileId)
      if(req.user._id ==req.body.profileId){
      if(req.body.reqType == "followers")
      {   
          const followersDataInFollowing = data.followers.filter(value1=>data.following.some(value2 => String(value1.myFollower._id)===String(value2.imFollowing._id)))
          const followersDataNotInFollowing = data.followers.filter(value1=>!data.following.some(value2 => String(value1.myFollower._id)===String(value2.imFollowing._id)))
          
          //console.log(followersDataInFollowing.length)
          //console.log(followersDataNotInFollowing.length)

          if(followersDataInFollowing.length!=0){
            followersDataInFollowing.forEach(element => {element.myFollower.is_following = true,element.myFollower.is_followed = true});
          }
      
          if(followersDataNotInFollowing.length!=0){
            followersDataNotInFollowing.forEach(element => { element.myFollower.is_following = true,element.myFollower.is_followed = false});
          }
          //console.log(followersDataInFollowing,followersDataNotInFollowing)
          const followers = data.followers
          res.status(200).send({status:200,message:"succesfully fetch followers list",followers})
      }

      else if(req.body.reqType == "following") 
      {   const following = data.following
          res.status(200).send({status:200,message:"succesfully fetch following list",following})
      }
      }
      else if (req.user._id !=req.body.profileId){
        const myProfile = await this.fetchUser_ID(req.user._id)
        if(req.body.reqType == "followers")
         {   
          const othersFollowersDataInMyFollowing = data.followers.filter(value1=>myProfile.following.some(value2 => String(value1.myFollower._id)===String(value2.imFollowing._id)))
          const othersFollowersDataNotInMyFollowing = data.followers.filter(value1=>!myProfile.following.some(value2 => String(value1.myFollower._id)===String(value2.imFollowing._id)))
          
          //console.log(othersFollowersDataInMyFollowing.length)
          //console.log(othersFollowersDataNotInMyFollowing.length)

          if(othersFollowersDataInMyFollowing.length!=0){
            othersFollowersDataInMyFollowing.forEach(element => {element.myFollower.is_followed = true});
          }
      
          if(othersFollowersDataNotInMyFollowing.length!=0){
            othersFollowersDataNotInMyFollowing.forEach(element => {element.myFollower.is_followed = false});
          }
          const followers = data.followers
          res.status(200).send({status:200,message:"succesfully fetch followers list",followers})
        }
        else if(req.body.reqType == "following"){
          
          const othersFollowingDataInMyFollowing = data.following.filter(value1=>myProfile.following.some(value2 => String(value1.imFollowing._id)===String(value2.imFollowing._id)))
          const othersFollowingDataNotInMyFollowing = data.following.filter(value1=>!myProfile.following.some(value2 => String(value1.imFollowing._id)===String(value2.imFollowing._id)))
          
          //console.log(othersFollowingDataInMyFollowing.length)
          //console.log(othersFollowingDataNotInMyFollowing.length)

          if(othersFollowingDataInMyFollowing.length!=0){
            othersFollowingDataInMyFollowing.forEach(element => {element.imFollowing.is_followed =true});
          }
      
          if(othersFollowingDataNotInMyFollowing.length!=0){
            othersFollowingDataNotInMyFollowing.forEach(element => {element.imFollowing.is_followed = false});
          }
          const following = data.following
          res.status(200).send({status:200,message:"succesfully fetch followers list",following})
        }
      }
    } catch (error) {
      handleError(res, error)
    }
  }
module.exports = {follower_following_list}