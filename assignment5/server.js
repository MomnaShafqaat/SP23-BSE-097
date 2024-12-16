const express = require("express");
const mongoose = require("mongoose");

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'], // Restrict file types
  },
});

const upload = multer({ storage: storage });


var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);


let connectionString = "mongodb://localhost:27017/chamberlain";
mongoose
  .connect(connectionString)
  .then( async () =>
    {
      console.log("Connected to Mongo DB Server: " + connectionString);
    } )
  .catch((error) => console.log(error.message));


//expose public folder for publically accessible static files
server.use(express.static("public"));


// add support for fetching data from request body
server.use(express.urlencoded());


let adminProductsRouter = require("./routes/admin/product.controller");
server.use(adminProductsRouter);


let adminCategoryController = require("./routes/admin/category.controller");
server.use(adminCategoryController) ;


const Category = require("./models/category.model") ;


server.get("/about-me", (req, res) => {
  return res.render("about-me");
});
server.get("/", (req, res) => {
  
  return res.render("homepage");
});

server.get('/admin/homepage', (req,res)=>{

  return res.render("partials/chamberlain" , {
    layout : "index",
    stylesheet : '/css/homepage.css'
  }) ;
})

//route to handle category form submission
server.post("/views/admin/create-category", upload.single('image') , async(req,res)=>{

  if (req.file) {
    console.log('File uploaded successfully! ');
  } else {
    console.log('File upload failed.');
  }
  let data = req.body;
  data.image = req.file.path;
  console.log(data) ;
    let category = new Category(data) ;
  
    await category.save() ;
    return res.redirect("/admin/category" ) ;
    
});


server.listen(3000, () => {
  console.log(`Server Started at localhost:5000`);
});