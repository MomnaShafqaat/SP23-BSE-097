const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const Category = require("../../models/category.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Manage categories
router.get("/admin/category", async (req, res) => {
  const categories = await Category.find();
  res.render("admin/category", {
    categories,
    layout: "adminlayout",
    pageTitle: "Manage Your Categories",
  });
});

// Create category
router.get("/views/admin/create-category", (req, res) => {
  res.render("admin/create-category", { layout: "formLayout" });
});

router.post("/views/admin/create-category", upload.single("image"), async (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
    image: req.file?.filename || null,
  };

  const category = new Category(data);
  await category.save();
  res.redirect("/admin/category");
});

// Delete category
router.get("/admin/categories/delete/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/admin/category");
});

module.exports = router;
