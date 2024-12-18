const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
email : {
    type: String , 
    required : true,
    unique:true
  },
  password : {
    type : String,
    required : true 
  },
  name : String ,
 role: { 
    type:String,
  default:"user" ,
  },

  },{timestamps:true});

let userModel = mongoose.model("user", userSchema);


module.exports = userModel;