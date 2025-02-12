const mongoose=require("mongoose");
const post = require("./post1");
mongoose.connect(`mongodb://localhost/mongopractice4`);
const userSchema= mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    password:String,
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }],
    profilepic:{
        type:String,
        default:"default.jpg"

    },
    likedposts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }]
});
module.exports=mongoose.model("use2",userSchema);