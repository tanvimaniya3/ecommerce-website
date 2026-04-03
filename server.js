const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const fs = require("fs");
const path = require("path");

// 🔥 uploads folder auto create
const uploadPath = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 CORS
app.use(cors());

// 🔥 MongoDB
mongoose.connect("mongodb+srv://maniyatanvi3_db_user:tanu1234@cluster0.hkwj6vf.mongodb.net/shopDB?retryWrites=true&w=majority")
.then(()=> console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// 🔥 Middlewares
app.use(express.static("public"));
app.use(express.json());

// 📸 Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// 🔥 Product Schema
const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  category: String,
  image: String,
  images: Array,
  description: String
});

// 🔥 Order Schema
const Order = mongoose.model("Order", {
  name: String,
  phone: String,
  pincode: String,
  state: String,
  address: String,
  items: Array,
  date: String,
  status: String
});

// ================= PRODUCTS =================

// 👉 All products
app.get("/api/products", async (req, res) => {
  let data = await Product.find();
  res.json(data);
});

// 👉 Single product
app.get("/api/products/:id", async (req, res) => {
  let data = await Product.findById(req.params.id);
  res.json(data);
});

// 👉 Add product (FIXED)
app.post("/api/products", upload.single("image"), async (req, res) => {

  try{

    let imagePath = "";

    // 🔥 safe check (IMPORTANT FIX)
    if(req.file){
      imagePath = "/uploads/" + req.file.filename;
    }

    let newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: imagePath, // अब crash नहीं होगा
      images: req.body.images ? req.body.images.split(",") : [],
      description: req.body.description
    });

    await newProduct.save();

    res.json({ message: "Product Added ✅" });

  }catch(err){

    console.log("ERROR:", err);
    res.status(500).json({ message: "Server Error ❌" });

  }

});

// ================= ORDERS =================

// 👉 Save order
app.post("/api/orders", async (req, res) => {
  let order = new Order(req.body);
  await order.save();
  res.json({ message: "Order Saved ✅" });
});

// 👉 Get all orders
app.get("/api/orders", async (req, res) => {
  let orders = await Order.find();
  res.json(orders);
});

// 👉 Update order
app.put("/api/orders/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ message: "Order Updated ✅" });
});

// 🔥 Server
app.listen(PORT, () => {
  console.log("Server running");
});

// 👉 DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted ✅" });
  }catch(err){
    res.status(500).json({ message: "Delete Error ❌" });
  }
});

// 👉 UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
  try{

    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      images: req.body.images ? req.body.images.split(",") : []
    });

    res.json({ message: "Product Updated ✅" });

  }catch(err){
    res.status(500).json({ message: "Update Error ❌" });
  }
});
