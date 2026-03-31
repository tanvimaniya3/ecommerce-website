async function loadOrders(){
let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");
box.innerHTML = "";

orders.reverse();

orders.forEach(order => {
box.innerHTML += `
<div class="order">
<h3>${order.name}</h3>

${order.items.map(p => `
<div>
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="60">
${p.name} - ₹${p.price} x ${p.qty}
</div>
`).join("")}

<p>Status: ${order.status}</p>

<select onchange="updateStatus('${order._id}', this.value)">
<option ${order.status==="Pending"?"selected":""}>Pending</option>
<option ${order.status==="Shipped"?"selected":""}>Shipped</option>
<option ${order.status==="Delivered"?"selected":""}>Delivered</option>
</select>

</div>
`;
});
}

async function updateStatus(id, status){
await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders/" + id,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({status})
});

alert("Updated");
loadOrders();
}

loadOrders();
