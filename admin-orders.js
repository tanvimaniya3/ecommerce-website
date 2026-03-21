async function loadOrders(){

let res = await fetch("/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");

box.innerHTML = "";

orders.forEach(order => {

box.innerHTML += `

<div style="border:1px solid black; padding:10px; margin:10px;">

<h3>Customer: ${order.name}</h3>
<p>Phone: ${order.phone}</p>
<p>Address: ${order.address}, ${order.state} - ${order.pincode}</p>

<h4>Products:</h4>

${order.items.map(p => `
<div>
<img src="${p.image}" width="60">
${p.name} - ₹${p.price} x ${p.qty}
</div>
`).join("")}

<br>

<p>Status: ${order.status}</p>

<select onchange="updateStatus('${order._id}', this.value)">
<option value="Pending">Pending</option>
<option value="Shipped">Shipped</option>
</select>

</div>

`;

});

}

// 🔥 update status
async function updateStatus(id, status){

await fetch("/api/orders/" + id,{
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