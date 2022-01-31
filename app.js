//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userschema= new mongoose.Schema({
  email:String,
  password:String
});
userschema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields: ["password"]});

const user=new mongoose.model("User",userschema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new user({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  user.findOne({email:username},function(err,founduser){
      if(err){
        console.log(err);
      }else{
        if(founduser){
        if(founduser.password===password){
          res.render("secrets");
        }
        }
      }
  });
});







app.listen(3000,function(){
  console.log("server started on port 3000.");
})
