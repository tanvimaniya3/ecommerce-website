let order = JSON.parse(localStorage.getItem("lastOrder"));

if(!order){
document.body.innerHTML = "<h2>No Order Found ❌</h2>";
}

// details
document.getElementById("cName").innerText = "Name: " + order.name;
document.getElementById("cPhone").innerText = "Phone: " + order.phone;
document.getElementById("cAddress").innerText =
"Address: " + order.address + ", " + order.state + " - " + order.pincode;

// items
let box = document.getElementById("orderItems");

order.items.forEach(p => {

box.innerHTML += `
<div>
<img src="https://ecommerce-website-1-s0j9.onrender.com${p.image}" width="80">
<h4>${p.name}</h4>
<p>₹${p.price} x ${p.qty}</p>
</div>
<hr>
`;

});
