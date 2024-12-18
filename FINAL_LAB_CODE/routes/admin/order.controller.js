const express = require('express');
const Order = require('../../models/order.model');  // Order model
const Product = require('../../models/product');  // Product model
const router = express.Router();




// Route to render the checkout page with products from the cart (use session or database to track cart)
router.get('/checkout', async (req, res) => {
  try {
    const cartItems = req.session.cart || [];  // Assuming cart items are stored in session

    // Render the checkout page, passing cart items
    res.render('checkout', {
      products: cartItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering checkout page.');
  }
});

// Route to handle the checkout POST request to create an order
router.post('/checkout', async (req, res) => {
  const { name, street, city, postalCode } = req.body;
  const cartItems = req.session.cart || [];  // Retrieve cart items

  try {
    // Calculate the total price
    const orderTotal = cartItems.reduce((total, product) => total + product.price, 0).toFixed(2);

    // Create a new order with customer info and items
    const newOrder = new Order({
      customerInfo: {
        name,
        address: {
          street,
          city,
          postalCode,
        }
      },
      orderItems: cartItems,
      orderTotal,
      orderDate: new Date()
    });

    // Save the new order to the database
    await newOrder.save();

    // Optionally, clear the cart after placing the order
    req.session.cart = [];

    // Respond with success or redirect
    res.status(201).json({ success: true, message: 'Order placed successfully' });
    // Optionally, you can redirect to a confirmation page: res.redirect('/order-confirmation');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error placing order', error });
  }
});


router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.render('admin/orders', { orders, layout: 'adminLayout' }); // Render the orders page with orders data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View past orders (for customer)
router.get("/orders", async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash("error", "Please log in to view your orders.");
      return res.redirect("/login");
    }

    // Fetch orders for the logged-in user
    const orders = await Order.find({ "customerInfo.name": req.session.user.name }).populate("orderItems.product");
    res.render("partials/orders", { orders });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to fetch orders.");
    res.redirect("/profile");
  }
});


module.exports = router;
