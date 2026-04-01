async function loadOrders(){

let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");
box.innerHTML = "";

// 🔥 STATS VARIABLES
let totalOrders = orders.length;
let totalRevenue = 0;
let pending = 0;
let shipped = 0;
let delivered = 0;

// 🔥 CALCULATE STATS
orders.forEach(o => {

if(o.total){
totalRevenue += o.total;
}else{
o.items.forEach(p=>{
totalRevenue += p.price * p.qty;
});
}

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


// 🔥 SHOW ORDERS
orders.reverse();

orders.forEach(order => {

box.innerHTML += `
<div class="order">

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

<p><b>Total:</b> ₹${order.total || "N/A"}</p>
<p><b>Status:</b> ${order.status}</p>

<select onchange="updateStatus('${order._id}', this.value)">
<option value="Pending" ${order.status==="Pending"?"selected":""}>Pending</option>
<option value="Shipped" ${order.status==="Shipped"?"selected":""}>Shipped</option>
<option value="Delivered" ${order.status==="Delivered"?"selected":""}>Delivered</option>
</select>

</div>
`;

});

}


// 🔥 UPDATE STATUS
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

// पहली बार load
loadOrders();
