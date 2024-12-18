const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const Category = require("../../models/category.model");
const { body, validationResult } = require("express-validator");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG formats are allowed."));
    }
    cb(null, true);
  },
});

router.get("/admin/category", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/category", {
      categories,
      layout: "adminlayout",
      pageTitle: "Manage Your Categories",
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("partials/error", {
      layout: "adminlayout",
      errorMessage: "Error fetching categories.",
    });
  }
});

router.post("/views/admin/create-category", upload.single("image"), async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      image: req.file?.filename || null,
    };
    const category = new Category(data);
    await category.save();
    req.flash("success", "Category created successfully.");
    res.redirect("/admin/category");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error creating category.");
    res.redirect("/views/admin/create-category");
  }
});

router.get("/admin/categories/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("success", "Category deleted successfully.");
    res.redirect("/admin/category");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error deleting category.");
    res.redirect("/admin/category");
  }
});

module.exports = router;
