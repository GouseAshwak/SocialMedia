const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const exerciseListSchema = new mongoose.Schema({    
    categorie:{
        type:String,
        required:true,
    },

    subCategorie:{
        type:String,
        default:undefined,
    },

    exerciseName:{
        type:String,
        default:null
    },

    excerciseImage:{
        type:Object,
        default:undefined
    },

    instructions:{
        type:Object,
        default:undefined
    },

    primaryMuscle:{
        type:String,
        default:null
    },

    secondaryMuscle:{
        type:String,
        default:null
    },

    type:{
        type:String,
        default:null
    }

    
},{timestamps:true})

exerciseListSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("exerciseList",exerciseListSchema)