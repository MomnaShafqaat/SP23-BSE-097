const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const Product = require("../../models/product.model");
const categoryModel = require("../../models/category.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Render product creation form
router.get("/views/admin/create", async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/create", {
    layout: "formLayout",
    categories,
  });
});

// Handle product creation
router.post("/views/admin/create", upload.single("file"), async (req, res) => {
  const { title, description, price, category } = req.body;

  const newProduct = new Product({
    title,
    description,
    price,
    category,
    picture: req.file?.filename || null,
  });

  await newProduct.save();
  res.redirect("/admin/products");
});

module.exports = router;
