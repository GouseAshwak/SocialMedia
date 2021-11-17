const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const setExerciseSchema = new mongoose.Schema({

    exerciseType:{type:String, default:undefined},
    subExcerciseType:{type:String,default:undefined},
    exerciseName:{type:String},
    excerciseImage:{type:Object},
    sets:[{type:Object}],
    type:{type:String},
    //setsLength:{type:Number},
    restBetweensets:{type:String},
    restAfterEachExercise:{type:String}
});

const createMyWorkOutProgramSchema = new mongoose.Schema({  
    
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
},{timestamps:true});

// setExerciseSchema.pre('validate', function (next) {
//     const that = this
//     that.setsLength = that.sets.length
//     next();
//   });   

createMyWorkOutProgramSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("CreateMyWorkOutProgram",createMyWorkOutProgramSchema)