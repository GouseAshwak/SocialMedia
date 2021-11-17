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

//check registered user Id or username
 exports.checkuserIDOrUsername = async (user) => {
    var cursorData;
    await User.find({$or:[{User_id:{$regex:user,'$options' : 'i'}},{name:{$regex:user,'$options' : 'i'}}]})
        .select("name User_id profile_info.profile_url followers following is_following is_followed")
        .then((result) => {
            cursorData = result;
        }).catch(err => {
            cursorData=null;
        });
        
    return cursorData;
}

/*
 * Search user controller
 */
const searchUser = async (req, res) => {
  try {  
         const id = await isIDGood(req.user._id)
         const data = await await this.fetchUser_ID(id)
         const searchDetails = await this.checkuserIDOrUsername(req.body.search_user)
         if (searchDetails != "") {
         
            for(var k=0;k<searchDetails.length;k++){

                var search = searchDetails[k];

                //In search list users followers list checks weather account user avalible

                if(search.followers.length != 0){

                for(var i=0;i<search.followers.length;i++){

               if(String(search.followers[i].myFollower) !== String(req.user._id) && String(search._id) !== String(req.user._id))
               {
               search.is_following = false
               search.is_followed = false
               console.log('follow'); 
               }
              else if(String(search.followers[i].myFollower) === String(req.user._id) && String(search._id) !== String(req.user._id))
               {
               search.is_following = false
               search.is_followed = true
               console.log('following');
               }
            }}else{
              search.is_following = false
              search.is_followed = false
              console.log('In else follow');
             }
               //In search list users followings list checks weather account user avalible
               if(search.following.length != 0){
     
                for(var i=0;i<search.following.length;i++){

                   if(String(search.following[i].imFollowing) === String(req.user._id) && String(search._id) !== String(req.user._id))
                    {
                    search.is_following = true
                    }
                  }//console.log("following:",search.is_following)

                 if(data.following.length != 0){
                 for(var i=0;i<data.following.length;i++){
                 if(String(data.following[i].imFollowing) === String(search._id) && String(search._id) !== String(req.user._id))
                 {
                 search.is_followed = true
                 }
                }}
                else if(data.following.length == 0)
                {
                search.is_followed = false}
                
                //console.log("followed:",search.is_followed)
               
               // console.log("finalResult",search.is_following,search.is_followed)

                if(search.is_following == true && search.is_followed == false){console.log('follow back');}

                else if(search.is_following == false && search.is_followed == false){console.log('follow');}

                else if((search.is_following == false || search.is_following == true) && search.is_followed == true){console.log('following');}

            }
            }                    
         res.status(200).send({ status: 200, message: "succesfully fetched search results",searchDetails});
         }
         else{
                res.status(200).send({ status: 500, message: "sorry no users found" });
         }
      } catch (error) {
        handleError(res, error)
  }
}

module.exports = { searchUser }