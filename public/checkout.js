// 🛒 LOAD CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let box = document.getElementById("orderItems");
let totalBox = document.getElementById("totalAmount");

let total = 0;

// 🔥 SHOW ORDER ITEMS
if(box){

box.innerHTML = "";

cart.forEach(p => {

total += p.price * p.qty;

box.innerHTML += `
<div style="display:flex; justify-content:space-between; margin:10px 0;">

<div>
<h4>${p.name}</h4>
<p>₹${p.price} x ${p.qty}</p>
</div>

</div>
<hr>
`;

});

}

// 💰 SHOW TOTAL
if(totalBox){
totalBox.innerText = "Total: ₹" + total;
}


// 📦 PLACE ORDER
document.getElementById("orderForm").addEventListener("submit", async function(e){

e.preventDefault();

let user = JSON.parse(localStorage.getItem("user"));

if(!user){

localStorage.setItem("redirectAfterLogin","checkout.html");

alert("Please login first");

window.location.href = "login.html";

return;

}

let order = {
name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
pincode: document.getElementById("pincode").value,
state: document.getElementById("state").value,
address: document.getElementById("address").value,
items: cart,
total: total,
date: new Date().toLocaleString(),
status: "Pending"
};

localStorage.setItem("lastOrder", JSON.stringify(order));

await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(order)
});

alert("Order Placed Successfully ✅");

localStorage.removeItem("cart");

window.location.href = "confirm.html";

});
