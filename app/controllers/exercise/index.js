const {createExercise} = require('./createExercise')
const {listExercise} = require('./listExercise')
const {createWorkout} = require('./createWorkout')
const {editMyWorkOut} = require('./editMyWorkOut')
const {deleteMyWorkOut} = require('./deleteMyWorkOut')
const {shareWorkoutPost} = require('./shareWorkoutPost')
const {likeWorkout} = require('./likeWorkout')
const {Myworkoutlist} = require('./Myworkoutlist')
const {commentWorkout} = require('./commentWorkout')
const {allWorkoutPost} = require('./allWorkoutPost')
const {addWorkoutInMyBucket} = require('./addWorkoutInMyBucket')
const {saveWorkoutProgress} = require('./saveWorkoutProgress')
const {workoutReport} = require('./workoutReport')
const {mostWorkoutReport} = require("./mostWorkoutReport")
const {myTraininigList} = require("./myTraininigList")
const {mySharedList} = require("./mySharedList")
module.exports = {
createExercise,
listExercise,
createWorkout,
editMyWorkOut,
deleteMyWorkOut,
shareWorkoutPost,
likeWorkout,
Myworkoutlist,
commentWorkout,
allWorkoutPost,
addWorkoutInMyBucket,
saveWorkoutProgress,
workoutReport,
mostWorkoutReport,
myTraininigList,
mySharedList
}