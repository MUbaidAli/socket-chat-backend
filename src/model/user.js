const mongoose   = require("mongoose");
const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true,trim:true},
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String,min:6,required:true,trim:true},
    profileUrl:{type:String,default:""}
    

},{timestamps:true})




const User = mongoose.model("User" , userSchema);


module.exports = User;


