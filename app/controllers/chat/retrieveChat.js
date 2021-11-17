const { isIDGood, handleError } = require('../../middleware/utils')
const Message = require('../../models/message')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const retrieveChat = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)

    if(req.body.conversationId.length == 0 || req.body.sender_Id.length == 0)
    {res.status(400).send({status:400, message:"conversationId or sender ID cannot be empty!!"})
    return;
    }
    
    const conversationId =req.body.conversationId;

    const sender_Id = req.body.senderId;

    await Message.find({$and: [{conversationId: conversationId},{deletedBy:{$nin:[sender_Id]}}]})
    .select('-deletedBy')
    .populate("user","name User_id")
    .populate({path:"replyMessageToId",select:'text',populate:{path:'user',model:'User', select:'name User_id'}}) 
    .then((previousChat)=>{
      res.status(200).send({ status: 200, message: "successfully chat has retrieved!!",previousChat});})
     .catch(Err => {
      res.status(500).send({
        status: 500,
        message:Err.message || "Some error occurred while retrieving chat."
      });
   });
       
  } catch (error) {
    console.log(error)
    handleError(res, error)
  }
}

module.exports = {retrieveChat}
