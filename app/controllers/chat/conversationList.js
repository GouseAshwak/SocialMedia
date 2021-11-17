const {isIDGood,handleError } = require('../../middleware/utils')
const Conversation = require('../../models/conversation')
const Message = require('../../models/message')
const asyncForEach = require('async-await-foreach') 


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const conversationList = async (req,res) => {
  
  try {

    let data =[];
      
    const id = await isIDGood(req.user._id)

    if(req.body.senderId.length == 0)
    {
    res.status(400).send({status:400, message:"sender ID cannot be empty!!"})
    return;
    }
    const senderID =req.body.senderId
    await Conversation.find({members: { $in: [senderID] }})
                                .populate("members","name User_id profile_info.profile_url")
                                .then(async(conversation_List)=>{
                                    if(conversation_List.length !=0){

                                        await asyncForEach(conversation_List, async (conversationlist) => {

                                            await Message.find({$and: [{conversationId: conversationlist._id},{deletedBy:{$nin:[senderID]}}]}).sort({_id:-1}).limit(10)
                                                         .select('-deletedBy')
                                                         .populate("user","name User_id")
                                                         .populate({path:"replyMessageToId",select:'text',populate:{path:'user',model:'User', select:'name User_id'}}) 
                                                         .then((chatObject)=>{
                                                            let previousChat = chatObject.reverse()
                                                            data.push({conversationlist,previousChat})
                                                             //console.log(data)
                                                          })
                                                          .catch(Err => {
                                                           res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving chat."});
                                                           });
                                        })

                                    res.status(200).send({ status: 200, message: "successfully chat has retrived with respect to conversation list!!",data});
                                 }
                                })
                                   .catch(Err => {
                                    res.status(500).send({status: 500,message:Err.message || "Some error occurred while retrieving chat."});
                                 });
  
   }catch (error) {
      console.log(error)
      handleError(res,error)
  }
}

module.exports = {conversationList}