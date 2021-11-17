const User = require('../../models/user')

const { handleError } = require('../../middleware/utils')

//checkUser-ID
exports.checkUser_ID = async (user_id) => {

  var cursor;
  await User.findOne({ User_id: user_id }).then(data => {
    cursor = data;
  })
    .catch(err => {
      cursor = null;
    });
  return cursor;
};

const createUser_ID = async (req, res) => {

  try {

    // Validate request
    if (!req.body.User_id || !req.body.email||!req.body.reqType) {
      res.status(400).send({ status: 400,message: "Username or email must not be empty!" });
      return;
    }

    const resultSet = await this.checkUser_ID(req.body.User_id)
    if (resultSet == null && req.body.reqType === 'checkAvailability') {
          res.status(200).send({ status: 200, message: "User_ID is available in OneCC!" });
        }
    else if (resultSet == null && req.body.reqType === 'saveUserID') {
         User.findOneAndUpdate({ email: req.body.email }, { $set: { User_id: req.body.User_id } }).exec()
        .then((resultSet) => {
          res.status(200).send({ status: 200, message: "User_id has been added successfully!!" });
        })
        .catch(Err => {
          res.status(500).send({
            status: 500,
            message:
              Err.message || "Some error occurred while addding User_id to the account."
          });
        });
    }
    else {
      res.status(500).send({
        status: 500,
        message:
          "User_ID is not avaliable in OneCC"
      });
    }

  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createUser_ID }