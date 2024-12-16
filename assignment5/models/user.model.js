const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username : {
    type: String , 
    required : true
  },
  password : {
    type : String,
    required : true 
  },
  name : String ,
  location : {
    city : {
        type : String ,
        required : true
    },
    address : {
        type: String ,
        required : true
    }
    

  }
});

let userModel = mongoose.model("user", userSchema);

module.exports = ProductModel;