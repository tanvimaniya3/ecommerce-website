const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔥 MongoDB
mongoose.connect("mongodb+srv://maniyatanvi3_db_user:tanu1234@cluster0.hkwj6vf.mongodb.net/shopDB?retryWrites=true&w=majority")
.then(()=> console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// 🔥 Cloudinary CONFIG (IMPORTANT)
cloudinary.config({
  cloud_name: "dneycnrh3",
  api_key: "438169669799823",
  api_secret: "ju0qxvJIc-vAB8bS5bgkytU32zk"
});

// 🔥 Multer (memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Product Schema
const Product = mongoose.model("Product", {
  stock: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  offerPrice: { type: Number, default: null },
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

// 🔥 ADD PRODUCT (FINAL)
app.post("/api/products", upload.single("image"), async (req, res) => {

  try {

    let imageUrl = "";

    // 🔥 Upload to Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ecommerce-products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    let newProduct = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      offerPrice: req.body.offerPrice ? Number(req.body.offerPrice) : null,
      category: req.body.category,
      image: imageUrl,
      description: req.body.description,
      stock: true,
      visible: true
    });

    await newProduct.save();

    res.json({ message: "Product Added ✅" });

  } catch (err) {
    console.log("ERROR 👉", err);
    res.status(500).json({ message: "Server Error ❌" });
  }

});


// UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
  try {
    let updateData = {};

    if(req.body.name !== undefined) updateData.name = req.body.name;
    if(req.body.price !== undefined) updateData.price = req.body.price;
    if(req.body.category !== undefined) updateData.category = req.body.category;
    if(req.body.description !== undefined) updateData.description = req.body.description;
    if(req.body.offerPrice !== undefined) updateData.offerPrice = req.body.offerPrice;
    if(req.body.stock !== undefined) updateData.stock = req.body.stock;
    if(req.body.visible !== undefined) updateData.visible = req.body.visible;

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Product Updated ✅" });

  } catch(err){
    console.log(err);
    res.status(500).json({ message: "Update Error ❌" });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
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
