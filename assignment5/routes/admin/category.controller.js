const express = require("express");
const multer = require('multer');
const path = require('path');
let router = express.Router();


// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../uploads')); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage: storage });


router.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));


const Category = require("../../models/category.model") ;

router.get("/admin/category" , async(req,res)=> {
    let categories = await Category.find() ;
    return res.render("admin/category" , {categories , layout : 'adminLayout' , pageTitle : "Manage your categories" } ) ;
})

router.get("/views/admin/create-category", (req,res)=>{
    return res.render("admin/create-category" , {layout : 'formLayout'}) ;
})

//
//router.post("/views/admin/create-category", upload.single('image') , async(req,res)=>{

  //if (req.file) {
    //console.log('File uploaded successfully! ');
  //} else {
    //console.log('File upload failed.');
  //}
  //let data = req.body;
  //data.image = 'uploads/' + path.basename(req.file.path); // Save only the filename or relative path

  //console.log(data) ;
    //let category = new Category(data) ;
    //await category.save() ;
    //return res.redirect("/admin/category" ) ;
    
//});

router.get("/admin/categories/delete/:id" , async (req,res)=>{
    
  await Category.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/category");
})

router.get("/admin/categories/edit/:id" , async(req,res)=>{
    let category = await Category.findById(req.params.id);
  return res.render("admin/edit-category", {
    layout: "adminlayout",
    category,
  });
})

router.post("/admin/categories/edit/:id" , async(req,res)=>{
    let category = await Category.findById(req.params.id);
  category.title = req.body.title;
  category.description = req.body.description;
  category.price = req.body.price;
  await category.save();
  return res.redirect("/admin/category");
})

router.get("/admin/mainmenu", async (req, res) => {
  
  let categories = await Category.find();

  return res.render("partials/categories",
     {
      stylesheet: '/css/mainMenuStyles',
      layout: 'index' ,
      
      categories
     });
});

module.exports = router ;