const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const fs = require("fs");
const path = require("path");

// uploads folder
const uploadPath = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// MongoDB
mongoose.connect("mongodb+srv://maniyatanvi3_db_user:tanu1234@cluster0.hkwj6vf.mongodb.net/shopDB?retryWrites=true&w=majority")
.then(()=> console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Product Schema (FIXED)
const Product = mongoose.model("Product", {
  stock: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  offerPrice: { type: Number, default: null },   // 🔥 FIX
  name: String,
  price: Number,
  category: String,
  image: String,
  images: Array,
  description: String
});

// Order Schema
const Order = mongoose.model("Order", {
  name: String,
  phone: String,
  pincode: String,
  state: String,
  address: String,
  items: Array,
  date: String,
  status: String,
  featured: { type: Boolean, default: false }
});

// ===== PRODUCTS =====

// GET
app.get("/api/products", async (req, res) => {
  let data = await Product.find();
  res.json(data);
});

// ADD PRODUCT ✅ FIXED
app.post("/api/products", async (req, res) => {
  try{

    let imagePath = "";

    if(req.file){
      imagePath = "/uploads/" + req.file.filename;
    }

    let newProduct = new Product({
      name: req.body.name,
      price: Number(req.body.price),

      // 🔥 FIX (MOST IMPORTANT)
      offerPrice: req.body.offerPrice ? Number(req.body.offerPrice) : null,

      category: req.body.category,
      image: req.body.image,
      images: req.body.images ? req.body.images.split(",") : [],
      description: req.body.description,
      stock: true,
      visible: true
    });

    await newProduct.save();

    res.json({ message: "Product Added ✅" });

  }catch(err){
    console.log("ADD ERROR:", err);   // 👈 IMPORTANT
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// UPDATE PRODUCT ✅ FIXED
app.put("/api/products/:id", async (req, res) => {
  try{

    let updateData = {};

    if(req.body.name !== undefined){
      updateData.name = req.body.name;
    }

    if(req.body.price !== undefined){
      updateData.price = req.body.price;
    }

    if(req.body.category !== undefined){
      updateData.category = req.body.category;
    }

    if(req.body.description !== undefined){
      updateData.description = req.body.description;
    }

    if(req.body.images !== undefined){
      updateData.images = req.body.images.split(",");
    }

    // 🔥 IMPORTANT FIX (offer delete nahi hoga)
    if(req.body.offerPrice !== undefined){
      updateData.offerPrice = req.body.offerPrice;
    }

    if(req.body.stock !== undefined){
      updateData.stock = req.body.stock;
    }

    if(req.body.visible !== undefined){
      updateData.visible = req.body.visible;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Product Updated ✅" });

  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Update Error ❌" });
  }
});

// DELETE
app.delete("/api/products/:id", async (req, res) => {
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  }catch(err){
    res.status(500).json({ message: "Delete Error ❌" });
  }
});

// delete order

app.delete("/api/orders/:id", async (req, res) => {
try{
await Order.findByIdAndDelete(req.params.id);
res.json({ message: "Order Deleted ✅" });
}catch(err){
res.status(500).json({ message: "Delete Error ❌" });
}
});

// ===== ORDERS =====

app.post("/api/orders", async (req, res) => {
  let order = new Order(req.body);
  await order.save();
  res.json({ message: "Order Saved ✅" });
});

app.get("/api/orders", async (req, res) => {
  let orders = await Order.find();
  res.json(orders);
});

app.put("/api/orders/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ message: "Order Updated ✅" });
});

app.listen(PORT, () => console.log("Server running 🚀"));
