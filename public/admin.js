let allOrders = [];
let currentFilter = "All";
let allProducts = [];
let currentCategory = "All";

// 🔁 PAGE LOAD
window.onload = function(){
if(localStorage.getItem("adminLogin") === "true"){
showDashboard();
}
};

// 🔐 LOGIN
function login(){
let user = document.getElementById("username").value.trim();
let pass = document.getElementById("password").value.trim();

if(user === "admin" && pass === "1234"){
localStorage.setItem("adminLogin","true");
showDashboard();
}else{
document.getElementById("error").innerText = "Wrong Username ❌";
}
}

// 🔓 LOGOUT
function logout(){
localStorage.removeItem("adminLogin");
location.reload();
}

// 📊 SHOW DASHBOARD
function showDashboard(){
document.getElementById("loginBox").style.display = "none";
document.getElementById("dashboard").style.display = "block";
loadOrders();
loadAdminProducts();
}

// 📦 LOAD ORDERS
async function loadOrders(){
let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders");
let orders = await res.json();

allOrders = orders;

let totalOrders = orders.length;
let totalRevenue = 0;
let pending = 0;
let shipped = 0;
let delivered = 0;

orders.forEach(o => {
let orderTotal = 0;

o.items.forEach(p=>{
orderTotal += p.price * p.qty;
});

o.calculatedTotal = orderTotal;
totalRevenue += orderTotal;

if(o.status === "Pending") pending++;
if(o.status === "Shipped") shipped++;
if(o.status === "Delivered") delivered++;
});

document.getElementById("totalOrders").innerText = totalOrders;
document.getElementById("totalRevenue").innerText = totalRevenue;
document.getElementById("pendingCount").innerText = pending;
document.getElementById("shippedCount").innerText = shipped;
document.getElementById("deliveredCount").innerText = delivered;

showFilteredOrders(orders.reverse());
}

// 🔥 SHOW ORDERS
function showFilteredOrders(orders){
let box = document.getElementById("ordersBox");
box.innerHTML = "";

orders.forEach(order => {

let orderId = "ORD" + order._id.slice(-5);

box.innerHTML += `
<div class="order">
<h3>${orderId}</h3>
<h3>${order.name}</h3>

${order.items.map(p => `
<div style="display:flex; gap:10px;">
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="60">
<div>${p.name} ₹${p.price} x ${p.qty}</div>
</div>
`).join("")}

<p>Total: ₹${order.calculatedTotal}</p>

<select onchange="updateStatus('${order._id}', this.value)">
<option ${order.status=="Pending"?"selected":""}>Pending</option>
<option ${order.status=="Shipped"?"selected":""}>Shipped</option>
<option ${order.status=="Delivered"?"selected":""}>Delivered</option>
</select>
</div>
`;
});
}

// UPDATE STATUS
async function updateStatus(id, status){
await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders/" + id,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({status})
});
alert("Updated ✅");
loadOrders();
}

// ================= PRODUCT =================

// ➕ ADD / UPDATE
document.getElementById("productForm").addEventListener("submit", async function(e){

e.preventDefault();
let form = this;

if(form.dataset.editId){

// 🔥 SAFE UPDATE (IMPORTANT)
let data = {
name: form.name.value,
price: form.price.value,
offerPrice: form.offerPrice.value || null,
category: form.category.value,
description: form.description.value,
images: form.images.value
};

await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products/" + form.dataset.editId,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(data)
});

alert("Updated ✅");
delete form.dataset.editId;

}else{

let formData = new FormData(form);
formData.append("offerPrice", form.offerPrice.value || "");

let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products",{
method:"POST",
body: formData
});

let data = await res.json();
alert(data.message || "Added ✅");
}

form.reset();
document.getElementById("preview").style.display = "none";
loadAdminProducts();

});

// LOAD PRODUCTS
async function loadAdminProducts(){
let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products");
let products = await res.json();
allProducts = products;
showProducts(products);
}

// SHOW PRODUCTS
function showProducts(products){

let box = document.getElementById("adminProducts");
box.innerHTML = "";

products.forEach(p => {

let discount = "";

if(p.offerPrice){
let percent = Math.round(((p.price - p.offerPrice) / p.price) * 100);
discount = `<p style="color:red;">🔥 ${percent}% OFF</p>`;
}

box.innerHTML += `
<div class="order">

<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="80">

<h3>${p.name}</h3>

${p.offerPrice ? `
<p>
<span style="text-decoration:line-through;">₹${p.price}</span>
<b style="color:green;"> ₹${p.offerPrice}</b>
</p>
${discount}
` : `<p>₹${p.price}</p>`}

<p>Stock: ${p.stock ? "In Stock" : "Out of Stock"}</p>
<p>Visible: ${p.visible ? "Yes" : "No"}</p>

<button onclick="deleteProduct('${p._id}')">Delete</button>
<button onclick='editProduct(${JSON.stringify(p)})'>Edit</button>

<button onclick="toggleStock('${p._id}', ${p.stock})">
${p.stock ? "Out of Stock" : "In Stock"}
</button>

<button onclick="toggleVisibility('${p._id}', ${p.visible})">
${p.visible ? "Hide" : "Show"}
</button>

</div>
`;
});
}

// STOCK
async function toggleStock(id, current){
await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products/" + id,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ stock: !current })
});
loadAdminProducts();
}

// VISIBILITY
async function toggleVisibility(id, current){
await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products/" + id,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ visible: !current })
});
loadAdminProducts();
}

// DELETE
async function deleteProduct(id){
if(confirm("Delete?")){
await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products/" + id,{method:"DELETE"});
loadAdminProducts();
}
}

// EDIT
function editProduct(p){
let form = document.getElementById("productForm");

form.name.value = p.name;
form.price.value = p.price;
form.offerPrice.value = p.offerPrice || "";
form.category.value = p.category;
form.description.value = p.description || "";
form.images.value = p.images ? p.images.join(",") : "";

form.dataset.editId = p._id;

window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
}

// RESET
function resetForm(){
let form = document.getElementById("productForm");
form.reset();
delete form.dataset.editId;
}
