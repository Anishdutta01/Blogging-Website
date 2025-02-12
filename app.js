const express=require("express");
const app=express();
const use2 = require("./modules/user");
const post1= require("./modules/post1");
const { name } = require("ejs");
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
var cookieParser=require('cookie-parser');
const path=require("path");
const upload=require("./config/multerconfig");
const expressSession=require("express-session");
const flash=require("connect-flash");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET,
})
);
app.use(flash());
app.set("view engines","ejs");

  

app.get("/",(req,res)=>{
    let err=req.flash("error");
    let success=req.flash("success");
    res.render("b.ejs",{err,success});
});
app.get("/profile/upload",isloggedin,(req,res)=>{
    res.render("upload.ejs")
})
app.post("/upload",isloggedin,upload.single("image"),async (req,res)=>{
    let user= await use2.findOne({email:req.user.email});
    user.profilepic=req.file.filename;
    await user.save();
    res.redirect("/profile");
})
app.post("/create",async (req,res)=>{
    let{name,email,age,password}=req.body;
    let use4=await use2.findOne({email});
    if(use4){
        
        req.flash("error","user already exists")
        res.redirect("/");
    }
    else{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                let createdUser=await use2.create({
                    name,
                    email,
                    age,
                    password:hash
                    
                }) 
            })


        })
        req.flash("success","user created successfully")
        res.redirect("/");
    }
});
    
app.get("/logout",isloggedin,(req,res)=>{
    res.cookie("token"," ");
    res.redirect("/");
});
app.post("/post",isloggedin,async (req,res)=>{
    let user=await use2.findOne({email:req.user.email});
    let {content}=req.body;
    let posts=await post1.create({
        postdata:content,
        user:user._id
    })
    user.post.push(posts._id);
    await user.save();
    res.redirect("/profile");
})
app.get("/login",(req,res)=>{
    res.render("log.ejs");
})
app.get("/profile",isloggedin,async (req,res)=>{
    let use=req.user;
    let user=await use2.findOne({email:use.email}).populate("post");
    

    res.render("profile.ejs",{user});
})
app.post("/login",async (req,res)=>{
    let{email,password}=req.body;
    let use5=await use2.findOne({email});
    if(!use5) {
        res.send("something went wrong");
        res.end();
    }
    else{
        bcrypt.compare(password,use5.password,(err,result)=>{
            if(result==false){
                res.send("Something went wrong");
                res.end();
            }
            else{
                let token =jwt.sign({email},"shhh");
                res.cookie("token",token);
                res.redirect("/profile");
            }
            
        })
    
    }
    
});
app.get("/like/:id",isloggedin,async(req,res)=>{
    let post=await post1.findOne({_id: req.params.id}).populate("user");
    let user=await use2.findOne({email:req.user.email})
    if(post.likes.indexOf(user._id)=== -1){
        post.likes.push(user._id);
    }
    else{
        post.likes.splice(post.likes.indexOf(user._id),1);
    }
    
    await post.save();
    res.redirect("/profile");

})
app.get("/edit/:id",isloggedin,async(req,res)=>{
    let post=await post1.findOne({_id:req.params.id}).populate("user");
    res.render("edit.ejs",{post});
})

app.post("/edit/:id",isloggedin,async(req,res)=>{
    await post1.findOneAndUpdate({_id:req.params.id},{postdata:req.body.newpost});
    res.redirect("/profile");
})

function isloggedin(req,res,next){
    if(req.cookies.token===" "){
        req.flash("error","you must be logged in");
        res.redirect("/");
    } 
        

    else{
        let data=jwt.verify(req.cookies.token,"shhh");
        req.user=data;
        next();
    }
    
    

}

app.listen(3000);