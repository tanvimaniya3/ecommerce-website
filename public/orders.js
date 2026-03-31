async function loadOrders(){

let res = await fetch("https://ecommerce-website-1-s0j9.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");

box.innerHTML = "";

// 🔥 latest first
orders.reverse();

orders.forEach(o => {

box.innerHTML += `

<div style="border:1px solid black; margin:10px; padding:10px;">

<h3>${o.name}</h3>
<p>${o.phone}</p>
<p>${o.address}, ${o.state} - ${o.pincode}</p>

<p>Status: ${o.status}</p>

<select onchange="changeStatus('${o._id}', this.value)">
<option value="">Change Status</option>
<option value="Pending" ${o.status==="Pending"?"selected":""}>Pending</option>
<option value="Shipped" ${o.status==="Shipped"?"selected":""}>Shipped</option>
<option value="Delivered" ${o.status==="Delivered"?"selected":""}>Delivered</option>
</select>

<hr>

</div>

`;

});

}

// 🔥 CHANGE STATUS FUNCTION
async function changeStatus(id, status){

if(!status) return;

await fetch("https://ecommerce-website-1-s0j9.onrender.com/api/orders/" + id,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({status})
});

alert("Status Updated ✅");

loadOrders();

}

loadOrders();
