let allOrders = [];
let currentFilter = "All";

async function loadOrders(){

let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders");
let orders = await res.json();

allOrders = orders;

let totalOrders = orders.length;
let totalRevenue = 0;
let pending = 0;
let shipped = 0;
let delivered = 0;

// 🔥 CALCULATE
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

// 🔥 SHOW STATS
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

// filter with status also
if(currentFilter !== "All"){
filtered = filtered.filter(o => o.status === currentFilter);
}

showFilteredOrders(filtered);

}


// 🔘 FILTER CLICK
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
<br><br>

<button onclick="deleteOrder('${order._id}')"
style="background:#e53935;color:white;border:none;padding:10px 15px;border-radius:6px;cursor:pointer;">
Delete Order ❌
</button>

</div>
`;

});

}
async function deleteOrder(id){

let ok = confirm("Delete this order?");

if(!ok) return;

await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders/" + id,{
method:"DELETE"
});

alert("Order Deleted ✅");

loadOrders();

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


// INIT
loadOrders();
