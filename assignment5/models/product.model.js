const mongoose = require("mongoose");
const categoryModel = require("./category.model");

let productSchema = mongoose.Schema({
  title: {
    type: String, 
    required: true ,
   },
 price: { 
   type: Number,
    required: true ,
   },
   category : {
     type: mongoose.Schema.Types.ObjectId,  
     ref: 'Category',
     required : true 
   },

picture: { 
   type:String,
   required: true ,
 },
},
{timestamps:true});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;