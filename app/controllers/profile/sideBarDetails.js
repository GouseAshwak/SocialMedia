const { getProfileFromDB } = require('./helpers')
const { isIDGood, handleError } = require('../../middleware/utils')

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const sideBarDetails = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const data = await getProfileFromDB(id)
    const sideBar_Details = {
      user_Name:data.user.name,
      user_ID:data.user.User_id,
      profile_pic:data.user.profile_info.profile_url
    }
    res.status(200).json({ status: 200, message: "successfully  fetched  sideBarDetails!",sideBar_Details})
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { sideBarDetails }
