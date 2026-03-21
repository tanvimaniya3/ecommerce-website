let order = JSON.parse(localStorage.getItem("lastOrder"));

// customer details
document.getElementById("cName").innerText = "Name: " + order.name;
document.getElementById("cPhone").innerText = "Phone: " + order.phone;
document.getElementById("cAddress").innerText = "Address: " + order.address + ", " + order.state + " - " + order.pincode;

// products
let box = document.getElementById("orderItems");

order.items.forEach(p => {

box.innerHTML += `
<div>
<img src="${p.image}" width="80">
<h4>${p.name}</h4>
<p>₹${p.price} x ${p.qty}</p>
</div>
<hr>
`;

});