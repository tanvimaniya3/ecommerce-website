let allOrders = []; // 🔥 global store

// 🔥 LOAD ORDERS
async function loadOrders(){

let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders");
let orders = await res.json();

orders.reverse(); // latest first

allOrders = orders; // save all orders

showOrders(orders);

}

// 🔥 SHOW ORDERS
function showOrders(orders){

let box = document.getElementById("ordersBox");
box.innerHTML = "";

if(orders.length === 0){
box.innerHTML = "<h3>No Orders Found ❌</h3>";
return;
}

orders.forEach(order => {

box.innerHTML += `
<div class="order">

<h3>👤 ${order.name}</h3>

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

// 🔍 FILTER + SEARCH
function filterOrders(){

let text = document.getElementById("searchOrder").value.toLowerCase();
let status = document.getElementById("statusFilter").value;

let filtered = allOrders.filter(o => {

let matchText =
o.name.toLowerCase().includes(text) ||
o.phone?.includes(text);

let matchStatus =
status === "" || o.status === status;

return matchText && matchStatus;

});

showOrders(filtered);

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
