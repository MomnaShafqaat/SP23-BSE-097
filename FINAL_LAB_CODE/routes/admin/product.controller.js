const express = require("express");
const router = express.Router();
const Product = require("../../models/product.model");

// Admin: Manage products
router.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("An error occurred.");
  }
});





// Shop now with pagination

router.get("/shop-now/:page?", async (req, res) => {
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 3;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);

  let products = await Product.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  const stylesheets = [ '/css/homepage' , '/css/products-page'];

  return res.render("partials/mainMenu", {
    layout: 'index',
    stylesheet: stylesheets,
    pageTitle: "Shop Now",
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
  });
});

// Add to cart
router.get("/add-to-cart/:id", (req, res) => {
  const cart = req.cookies.cart || [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  res.redirect("/shop-now");
});

// View cart

//routes for cart functionality
router.get("/add-to-cart/:id" , (req,res)=>{
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  res.redirect("/shop-now") ;
});

router.get("/cart", async(req,res)=>{
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await Product.find({ _id: { $in: cart } });
  let stylesheet = ["/css/homepage" , "/css/mainMenuStyles"] ;
  return res.render("partials/cart", { products , stylesheet, layout:"index" });
}) ;

module.exports = router;
