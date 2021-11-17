const {createPost} = require('./createPost')
const {myPost} = require('./myPost')
const {allPost} = require('./allPost')
const {postEdit} = require('./postEdit')
const {deletePost} = require('./deletePost')
const {likeOrUnlikePost} = require('./likeOrUnlikePost')
const {viewPost} = require('./viewPost')
const {commentPost} = require('./commentPost')
const {deleteComment} = require('./deleteComment')
const {likeComment} = require('./likeComment')
const {unlikeComment} = require('./unlikeComment')
const {commentList} = require('./commentList')
module.exports = {
  createPost,
  myPost,
  allPost,
  postEdit,
  deletePost,
  likeOrUnlikePost,
  viewPost,
  commentPost,
  deleteComment,
  likeComment,
  unlikeComment,
  commentList
}