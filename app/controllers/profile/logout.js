/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

/*
 * logout controller
 */
const logout = async (req, res) => {
  
    try {

    //const finaltoken = req.headers.authorization.replace('Bearer ', 'x010').trim();
    
    res.status(200).send({status:200,message:'user has been logged out successfully!'});
    } catch (error) {
        handleError(res, error)
      }
}

module.exports = {logout}