let allOrders = [];
let currentFilter = "All";

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

// 🔍 SEARCH
function searchOrders(){

let input = document.getElementById("searchInput").value.toLowerCase();

let filtered = allOrders.filter(order => {

let orderId = "ord" + order._id.slice(-5);

return (
order.name.toLowerCase().includes(input) ||
order.phone.includes(input) ||
orderId.includes(input)
);

});

if(currentFilter !== "All"){
filtered = filtered.filter(o => o.status === currentFilter);
}

showFilteredOrders(filtered);
}

// 🔘 FILTER
function filterStatus(status){

currentFilter = status;

let filtered = allOrders;

if(status !== "All"){
filtered = allOrders.filter(o => o.status === status);
}

showFilteredOrders(filtered);
}

// 🔥 SHOW UI
function showFilteredOrders(orders){

let box = document.getElementById("ordersBox");
box.innerHTML = "";

orders.forEach(order => {

let orderId = "ORD" + order._id.slice(-5);

let color = "black";
if(order.status === "Pending") color = "orange";
if(order.status === "Shipped") color = "blue";
if(order.status === "Delivered") color = "green";

box.innerHTML += `
<div class="order">

<h3>🆔 ${orderId}</h3>

<h3>👤 ${order.name}</h3>
<p>📞 ${order.phone}</p>
<p>📍 ${order.address}, ${order.state} - ${order.pincode}</p>

<h4>🛒 Items:</h4>

${order.items.map(p => `
<div style="display:flex; gap:10px; align-items:center;">
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="60">
<div>
${p.name}<br>
₹${p.price} x ${p.qty}
</div>
</div>
`).join("")}

<br>

<p><b>Total:</b> ₹${order.calculatedTotal}</p>

<p><b>Status:</b> 
<span style="color:${color}; font-weight:bold;">
${order.status}
</span>
</p>

<select onchange="updateStatus('${order._id}', this.value)">
<option value="Pending" ${order.status==="Pending"?"selected":""}>Pending</option>
<option value="Shipped" ${order.status==="Shipped"?"selected":""}>Shipped</option>
<option value="Delivered" ${order.status==="Delivered"?"selected":""}>Delivered</option>
</select>

</div>
`;

});
}

// 🔄 UPDATE STATUS
async function updateStatus(id, status){

await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders/" + id,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({status})
});

alert("Status Updated ✅");
loadOrders();
}

// ➕ ADD PRODUCT
document.addEventListener("DOMContentLoaded", function(){

let form = document.getElementById("productForm");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

let formData = new FormData(form);

let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/products",{
method:"POST",
body: formData
});

let data = await res.json();

alert(data.message || "Product Added ✅");

form.reset();

});

}

});
