const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  title: String,
  image : String,},
{timestamps:true});

let categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;