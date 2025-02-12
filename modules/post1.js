const mongoose=require("mongoose");
const user = require("./user");

const postSchema=mongoose.Schema({
    postdata:String,
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'use2'
    }],
    date:{
        type:Date,
        default:Date.now

    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'use2'
    }]
    
})
module.exports=mongoose.model("post",postSchema);