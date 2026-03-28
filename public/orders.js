async function loadOrders(){

let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");

box.innerHTML = "";

orders.forEach(o => {

box.innerHTML += `

<div style="border:1px solid black; margin:10px; padding:10px;">

<h3>${o.name}</h3>
<p>${o.phone}</p>
<p>${o.address}, ${o.state} - ${o.pincode}</p>

<p>Status: ${o.status}</p>

<select onchange="changeStatus('${o._id}', this.value)">
<option value="">Change Status</option>
<option value="Pending">Pending</option>
<option value="Shipped">Shipped</option>
<option value="Delivered">Delivered</option>
</select>

<hr>

</div>

`;

});

}

// 🔥 CHANGE STATUS FUNCTION
async function changeStatus(id, status){

await fetch("https://ecommerce-website-pmr7.onrender.com/api/orders" + id,{
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