async function loadOrders(){

let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");
box.innerHTML = "";

// 🔥 latest first
orders.reverse();

if(orders.length === 0){
box.innerHTML = "<h3>No Orders Yet ❌</h3>";
return;
}

orders.forEach(order => {

box.innerHTML += `

<div class="order" style="border:1px solid #ccc; padding:10px; margin:10px; border-radius:10px;">

<h3>👤 ${order.name}</h3>
<p>📞 ${order.phone}</p>
<p>📍 ${order.address}, ${order.state} - ${order.pincode}</p>

<h4>🛒 Products:</h4>

${order.items.map(p => `
<div style="display:flex; gap:10px; align-items:center;">
<img src="https://ecommerce-website-pmr7.onrender.com${p.image}" width="60">
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


// 🔥 UPDATE STATUS
async function updateStatus(id, status){

await fetch("https://ecommerce-website-pmr7.onrender.com/api/orders/" + id,{
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
