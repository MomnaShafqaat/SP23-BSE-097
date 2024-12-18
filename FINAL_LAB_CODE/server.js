const express = require("express");
const path = require('path');
const session = require('express-session');
const mongoose = require("mongoose");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");



require("dotenv").config();
const authMiddleware = require("./middleware/auth-middleware");
const adminMiddleware = require("./middleware/admin-middleware");
const siteMiddleware = require("./middleware/site-middleware");
const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
// Serve static files from the 'public' directory
app.use(express.static("public"));

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

// Middleware for layouts and flash messages
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
app.use(expressLayouts);
app.use(flash());

// Middleware for session and cookies
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Use a secure key for the session secret
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Session cookie expires in 1 day
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
);


app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});



// View engine setup (using EJS)
app.set("view engine", "ejs");



// Database connection
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017/chamberlain";
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB Server: " + connectionString);
  })
  .catch((error) => console.log(error.message));

// Routes for admin
const adminProductsRouter = require("./routes/admin/product.controller");
const adminCategoryController = require("./routes/admin/category.controller");
const createform = require("./routes/admin/create.form");
const adminUserController = require("./routes/admin/user.controller");
//const cartRoutes = require('./routes/admin/cart.routes');
app.use(adminProductsRouter);
app.use(adminCategoryController);
app.use(createform);
app.use(adminUserController);


const Category = require("./models/category.model") ;




// Global Middleware
app.use(siteMiddleware); 




app.get('/', (req, res) => {
  // Check if there's a user session (assuming you store the user object in the session)
  const user = req.session.user ; // User is either from session or null if not logged in
  
  let btn;
  if (req.params.btn) {
    btn = req.params.btn;
  } else {
    btn = "partials/login-tag"; // Default button if not defined
  }
  
  // If the user has a role of admin, redirect to the admin homepage
  if (req.session.user?.role === "admin") {
    return res.redirect("/admin/homepage");
  } else {
    // Render the main homepage (or a regular page) for non-admin users
    return res.render("partials/chamberlain", {
      layout: "index", 
      btn,  // Passing dynamic button
      stylesheet: "/css/homepage.css", // Add CSS dynamically if needed
      user,  // Pass the user object to the view
    });
  }
});


app.get("/about-me", (req, res) => {
  return res.render("about-me");
});




app.get("/admin/homepage", (req, res) => {
  
  return res.render("homepage");
});
/*
app.get("/", (req, res) => {
  const user = req.session.user || null; // Get user from session, or set it as null if not logged in
  res.render("homepage", { user });  // Pass user to the template
});
*/



app.get('/', (req, res) => {
  console.log('Session:', req.session);
  res.render('index', { user: req.session.user || null });
});
/*app.get('/', (req,res)=>{

  if (req.session.user?.role === "admin") {
    // Redirect to the admin homepage if the user is an admin
    return res.redirect("/admin/homepage");
  } else {
    let btn ;
    if(req.params.btn)
      btn = req.params.btn;
    else
    btn = "partials/login-tag" ;
    const user = req.session.user || null;
    // If not an admin, render the main menu or a regular page
    return res.render("partials/chamberlain", {
      layout: "index", 
      btn,
      stylesheet: "/css/homepage.css"
    });
  }
})
*/
app.post('/login', (req, res) => {
  // Assume user authentication is successful and user data is available
  req.session.user = userData;  // Store the user data in the session
  res.redirect('/');  // Redirect to home page or desired page
});


// Admin homepage route
app.get("/admin/homepage",  (req, res) => {
  return res.render("partials/chamberlain", {
    layout: "index",
    btn:"partials/login-tag" ,
    stylesheet: "/css/homepage",
  });
});

// Route to handle category form submission
//route to handle category form submission
app.post("/views/admin/create-category", upload.single('image') , async(req,res)=>{

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


app.use("/", authMiddleware, adminMiddleware, adminProductsRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server Started at localhost:3000");
});


/*
// Cart routes for adding, viewing, and removing items
app.post("/cart/add",authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  // Get the current cart from session or initialize a new one
  let cart = req.session.cart || [];

  // Check if the product already exists in the cart
  const existingProductIndex = cart.findIndex(item => item.productId.toString() === productId);

  if (existingProductIndex !== -1) {
    // If product exists, update the quantity
    cart[existingProductIndex].quantity += parseInt(quantity);
  } else {
    // If not, add the new product to the cart
    cart.push({ productId, quantity: parseInt(quantity) });
  }

  // Save the updated cart in the session
  req.session.cart = cart;

  res.redirect('/cart');
});

app.get("/cart", authMiddleware,(req, res) => {
  const cart = req.session.cart || [];
  let totalAmount = 0;

  // Calculate total amount for the cart
  cart.forEach(item => {
    totalAmount += item.quantity * item.productId.price; // Assuming price is available on productId
  });
 
  res.render("cart", { cart, totalAmount });
});



// Remove product from cart
app.get("/cart/remove/:productId", (req, res) => {
  const productId = req.params.productId;
  let cart = req.session.cart || [];

  // Remove the product from the cart
  cart = cart.filter(item => item.productId.toString() !== productId);

  // Save the updated cart in the session
  req.session.cart = cart;

  res.redirect('/cart');
});

Update product quantity in cart
app.post("/cart/update", (req, res) => {
  const { productId, quantity } = req.body;
  let cart = req.session.cart || [];

  // Update the quantity of the product in the cart
  const cartItemIndex = cart.findIndex(item => item.productId.toString() === productId);

  if (cartItemIndex !== -1) {
    cart[cartItemIndex].quantity = parseInt(quantity);
    req.session.cart = cart; // Save updated cart in session
  }

  res.redirect('/cart');
});
*/
/* Example using express-session and checking if user is logged in
app.get('/', (req, res) => {
  // Assuming you're storing the user info in the session
  const user = req.session.user; // Or req.user if using passport.js
  res.render('index', { user });
});*/