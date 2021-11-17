const { isIDGood, handleError } = require('../../middleware/utils')
const User = require('../../models/user')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

//checkUser-ID
exports.fetchUser_ID = async (obj_id) => {
 
  var cursor;
  await User.findOne({ _id: obj_id }).then(data => {
    cursor = data;
  })
    .catch(err => {
      cursor = null;
    });
  return cursor;
};

/*
 * SuggestedUsers controller
 */
const SuggestedUsers = async (req, res) => {
  try {

       const myProfile = await this.fetchUser_ID(req.user._id)

       const following = [];

       if(myProfile.following.length !=0){
          for( i=0;i<myProfile.following.length;i++){
              following.push(myProfile.following[i].imFollowing)}
       }
       following.push(req.user._id)

       const newArr = following
 
       const num  = req.query.num || 10

       const suggestionProfile = await User.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'User', localField: 'followers.myFollower', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'User', localField: 'following.imFollowing', foreignField: '_id', as: 'following' } },
            ]).project("-password -role -lat -long -is_verified -is_profileSetup -otp -expiry_time -verification -createdAt -updatedAt")
        
            if(suggestionProfile!=0){
            return res.status(200).send({ status:200, message:"suggested profiles",suggestionProfile, result: suggestionProfile.length})
            }else if(suggestionProfile ==0){
              return res.status(200).send({ status:200, message:"No suggested profiles"})
            }
      } catch (error) {
        handleError(res, error)
      }
}

module.exports = { SuggestedUsers }