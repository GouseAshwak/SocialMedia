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

const currentLocation = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const resultSet = await this.fetchUser_ID(id)
    if (resultSet != null) {
        User.findOneAndUpdate({_id:resultSet._id}, { $set: { lat: req.body.latitude,long:req.body.longitude } }).exec()
       .then((resultSet) => {
         res.status(200).send({ status: 200, message: "Thanks for enabling location services for better experince in oneCC" });
       })
      .catch(Err => {
         res.status(500).send({
           status: 500,
           message:
             Err.message || "Some error occurred while updating your current location."
         });
       });
      }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { currentLocation }