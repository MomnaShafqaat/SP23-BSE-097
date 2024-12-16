const express = require("express");
let router = express.Router();


const Product = require("../../models/product.model") ;
const multer = require('multer');
const categoryModel = require("../../models/category.model");



// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage: storage });


//form is fetched
router.get('/views/admin/create', async(req,res)=> {
  let categories = await categoryModel.find() ;
  
  return res.render("admin/create",{
      layout: "formLayout",
      categories
  }) ;
});

//form submission handled here
router.post("/views/admin/create", upload.single("file"), async (req, res) => {
  let data = req.body;
  
  let newProduct = new Product(data);
  
  if (req.file) {
    newProduct.picture = req.file.filename;
  }
  await newProduct.save();
  
  // we will send data to model to save in db

    
    return res.redirect("/admin/products");

  // return res.send(newProduct);
  // return res.render("admin/product-form", { layout: "adminlayout" });
});

router.get("/admin/products", async (req, res) => {
  
let products =  await Product.find().populate('category') ;

  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});

router.get("/shop-now" , async(req, res) => {
  let products =  await Product.find() ;
  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products
  })
})

router.get("/admin/products/delete/:id" , async(req, res) =>{
  let params = req.params;
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
})

router.get("/admin/products/edit/:id" , async(req,res)=> {
  let product = await Product.findById(req.params.id);
  return res.render("admin/edit-product", {
    layout: "adminlayout",
    product,
  });
})

router.post("/admin/products/edit/:id" , async(req,res)=>{
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
})

router.get("/sort-lowtohigh", async(req,res)=>{
  let products = await Product.find().sort({ price: 1 });
  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products
  })
} )

router.get("/sort-hightolow", async(req,res)=>{
  let products = await Product.find().sort({ price: -1 });
  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products
  })
} )


module.exports = router;