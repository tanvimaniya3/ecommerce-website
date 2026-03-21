const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb+srv://maniyatanvi3_db_user:tanu1234@cluster0.hkwj6vf.mongodb.net/shopDB?retryWrites=true&w=majority")
.then(()=> console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

app.use(express.static("public"));
app.use(express.json());

// 📸 image upload
const storage = multer.diskStorage({
destination: (req,file,cb)=> cb(null,"public/uploads"),
filename: (req,file,cb)=> cb(null, Date.now()+"-"+file.originalname)
});
const upload = multer({storage});

// 🔥 Product Schema
const Product = mongoose.model("Product",{
name:String,
price:Number,
category:String,
image:String,
images:Array,
description:String
});

// 🔥 Order Schema
const Order = mongoose.model("Order",{
name:String,
phone:String,
pincode:String,
state:String,
address:String,
items:Array,
date:String,
status:String
});

// ================= PRODUCTS =================

// all products
app.get("/api/products", async (req,res)=>{
let data = await Product.find();
res.json(data);
});

// single product
app.get("/api/products/:id", async (req,res)=>{
let data = await Product.findById(req.params.id);
res.json(data);
});

// add product
app.post("/api/products", upload.single("image"), async (req,res)=>{

let newProduct = new Product({
name:req.body.name,
price:req.body.price,
category:req.body.category,
image:"/uploads/"+req.file.filename,
images: req.body.images ? req.body.images.split(",") : [],
description:req.body.description
});

await newProduct.save();

res.json({message:"Product Added"});
});

// ================= ORDERS =================

app.post("/api/orders", async (req,res)=>{
let order = new Order(req.body);
await order.save();
res.json({message:"Order Saved"});
});

app.get("/api/orders", async (req,res)=>{
let orders = await Order.find();
res.json(orders);
});

app.put("/api/orders/:id", async (req,res)=>{
await Order.findByIdAndUpdate(req.params.id,{status:req.body.status});
res.json({message:"Updated"});
});

app.listen(PORT,()=>{
console.log("Server running on http://localhost:3000");
});