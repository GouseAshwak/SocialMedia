const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

// const exerciseSchema = new mongoose.Schema({
//     exerciseName:{type:String, required:true},
//     sets:[{type:Object}],
// });

const workoutProgressSchema = new mongoose.Schema({  
    
    user:{
        type:ObjectId,
        ref:"User"
     },
     workOutProgramID:{
        type:ObjectId,
        refPath: 'onModel'
     },

     onModel: {
        type: String,
        required: true,
        enum: ['createmyworkoutprograms', 'addworkoutinlists']
      },

    warmUp:{type:String,required:true},

    exercise:[{type:Object,required:true}],

    reps:{type:String},

    kg:{type:String},

    totalTime:{type:String,required:true},

    note:{type:String},

    photos:{type:Object},

},{
    timestamps: true
  });

workoutProgressSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("WorkoutProgress",workoutProgressSchema)