document.getElementById("orderForm").addEventListener("submit", async function(e){

e.preventDefault();

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let order = {
name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
pincode: document.getElementById("pincode").value,
state: document.getElementById("state").value,
address: document.getElementById("address").value,
items: cart,
date: new Date().toLocaleString(),
status: "Pending"
};

localStorage.setItem("lastOrder", JSON.stringify(order));

await fetch("https://ecommerce-website-pmr7.onrender.com/api/orders",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(order)
});

alert("Order Placed ✅");

localStorage.removeItem("cart");

window.location.href = "confirm.html";

});
