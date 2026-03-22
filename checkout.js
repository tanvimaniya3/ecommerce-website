// 🔥 CART LOAD
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🔥 SHOW TOTAL
let total = 0;

cart.forEach(p => {
total += p.price * (p.qty || 1);
});

document.getElementById("totalPrice").innerText = total;


// 🔥 PLACE ORDER
document.getElementById("orderForm").addEventListener("submit", async function(e){

e.preventDefault();

// customer data
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

// 🔥 SAVE FOR CONFIRM PAGE
localStorage.setItem("lastOrder", JSON.stringify(order));


// 🔥 SEND TO SERVER
let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/products",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(order)
});

let data = await res.json();

alert("Order Placed Successfully");

// 🔥 CART CLEAR
localStorage.removeItem("cart");

// 🔥 REDIRECT TO CONFIRM PAGE
window.location.href = "confirm.html";

});
