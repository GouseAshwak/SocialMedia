const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const postSchema = new mongoose.Schema({
    Text:{
        type:Object,
        default:undefined
    },
    photos:{
        type:Object,
        default:undefined
    },

    tumbnails:{
        type:Object,
        default:undefined
    },
   postType:{
        type:String,
        required:true
    },

    postCategory:{
        type:String,
        default:null
    },

    likes:[{type:ObjectId,ref:"User"}],

    views:[{type:ObjectId,ref:"User"}],

    comments:[{
        text:String,
        commentPostedBy:{type:ObjectId,ref:"User"},
        commentPostedTime:{type:Date, default:Date.now},
        commentLikedBy:[{type:ObjectId,ref:"User"},{timestamps:true}]
    }],

    postedBy:{
       type:ObjectId,
       ref:"User"
    }
},{timestamps:true})

postSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Post",postSchema)