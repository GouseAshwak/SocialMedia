const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const { roleAuthorization } = require('../controllers/auth')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {createExercise,listExercise,
      createWorkout,editMyWorkOut,
      deleteMyWorkOut,shareWorkoutPost,
      likeWorkout,Myworkoutlist,
      commentWorkout,allWorkoutPost,
      addWorkoutInMyBucket,saveWorkoutProgress,
      workoutReport,mostWorkoutReport,
      myTraininigList,mySharedList} = require('../controllers/exercise');
 
 const multer = require("multer");
 var storage = multer.memoryStorage();
 var upload = multer({ storage: storage });

/*
 *retrieveChat routes
 */
router.post(
    '/createExercise',
    requireAuth,
    roleAuthorization(['user', 'admin']),
    trimRequest.all,
    upload.array('file', 1),
    createExercise 
)

/*
 *retrieve listExercise routes
 */
 router.post(
    '/listExercise',
    requireAuth,
    roleAuthorization(['user', 'admin']),
    trimRequest.all,
    listExercise
)

/*
 *create workout routes
 */
 router.post(
  '/createWorkout',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  createWorkout
)
/*
 *edit workout routes
 */
 router.post(
  '/editMyWorkOut',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  editMyWorkOut
)

/*
 *delete workout routes
 */
 router.delete(
  '/deleteMyWorkOut',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  deleteMyWorkOut
)

/*
 *shareWorkoutPost workout routes
 */
 router.post(
  '/shareWorkoutPost',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  shareWorkoutPost
)

/*
 *shareWorkoutPost workout routes
 */
 router.post(
  '/likeWorkout',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  likeWorkout
)

/*
 *Myworkoutlist workout routes
 */
 router.get(
  '/Myworkoutlist',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  Myworkoutlist
)

/*
 *commentWorkout workout routes
 */
 router.post(
  '/commentWorkout',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  commentWorkout
)

/*
 *allWorkoutPost routes
 */
 router.post(
  '/mostPopularWorkouts',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  allWorkoutPost
)

/*
 *addWorkoutInMyBucket routes
 */
 router.post(
  '/addWorkoutInMyBucket',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  addWorkoutInMyBucket
)

/*
 *saveWorkoutProgress routes
 */
 router.post(
  '/saveWorkoutProgress',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  upload.array('file', 10),
  saveWorkoutProgress
)

/*
 *workoutReport routes
 */
 router.post(
  '/workoutReport',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  workoutReport
)

/*
 *mostWorkoutReport routes
 */
 router.get(
  '/mostWorkoutReport',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  mostWorkoutReport
)

/*
 *myTraininigList routes
 */
 router.post(
  '/myTraininigList',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  myTraininigList
)

/*
 *mySharedList routes
 */
 router.post(
  '/mySharedList',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  mySharedList
)

module.exports = router