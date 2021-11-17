const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const setExerciseSchema = new mongoose.Schema({

    exerciseType:{type:String, default:undefined},
    subExcerciseType:{type:String,default:undefined},
    exerciseName:{type:String},
    excerciseImage:{type:Object},
    sets:[{type:Object}],
    restBetweensets:{type:String},
    restAfterEachExercise:{type:String}
});

const workOutDashboardSchema = new mongoose.Schema({  
    
    user:{
        type:ObjectId,
        ref:"User"
     },
   giveNameOfYourProgram:{
        type:String,
        required:true
    },

    selectWeekdaysOfWorkout:{
        type:Object,
        default:undefined
    },

    setExercise:[setExerciseSchema],

    writeSomethingHere:{type:String},

    workoutType: {type:String,required:true},

    likes:[{type:ObjectId,ref:"User"}],

    comments:[{
        text:String,
        commentPostedBy:{type:ObjectId,ref:"User"},
        commentPostedTime:{type:Date, default:Date.now},
    }],

    addWorkout:[{
        type:ObjectId,
        ref:"User",
    }]

},{timestamps:true});

workOutDashboardSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("workOutDashboard",workOutDashboardSchema)