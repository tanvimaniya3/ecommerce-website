async function loadOrders(){

let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");

box.innerHTML = "";

orders.reverse().forEach(order => {

box.innerHTML += `

<div class="order">

<h3>👤 ${order.name}</h3>
<p>📞 ${order.phone}</p>
<p>📍 ${order.address}, ${order.state} - ${order.pincode}</p>

<h4>🛒 Products:</h4>

${order.items.map(p => `
<div>
<img src="https://ecommerce-website-pmr7.onrender.com${p.image}" width="60">
${p.name} - ₹${p.price} x ${p.qty}
</div>
`).join("")}

<br>

<p>Status: ${order.status}</p>

<select onchange="updateStatus('${order._id}', this.value)">
<option ${order.status==="Pending"?"selected":""}>Pending</option>
<option ${order.status==="Shipped"?"selected":""}>Shipped</option>
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

alert("Status Updated");

loadOrders();

}

loadOrders();