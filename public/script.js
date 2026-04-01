fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {
showProducts(data);
});

function showProducts(products){
let box = document.getElementById("productContainer");
if(!box) return;

box.innerHTML = "";

products.forEach(p => {
box.innerHTML += `
<div class="product">
<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>
<p>₹${p.price}</p>
<button onclick="addToCart('${p._id}')">Add to Cart</button>
</div>
`;
});
}

function addToCart(id){
fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {

let product = data.find(p => p._id == id);
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(p => p._id == id);

if(existing){
existing.qty += 1;
}else{
product.qty = 1;
cart.push(product);
}

localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to Cart");
updateCartCount();
});
}

function updateCartCount(){
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let count = 0;

cart.forEach(p=>{
count += p.qty || 1;
});

let cartBox = document.getElementById("cartCount");
if(cartBox) cartBox.innerText = count;
}

// 🔥 FINAL SEARCH FIX (ONLY THIS USED)
document.addEventListener("DOMContentLoaded", function(){

let btn = document.getElementById("searchBtn");
let box = document.getElementById("searchBox");

if(btn && box){

btn.addEventListener("click", function(){
box.classList.toggle("active");
box.focus();
});

box.addEventListener("keyup", function(e){
if(e.key === "Enter" && box.value.length > 2){
window.location.href = "products.html?search=" + box.value;
}
});

}

});

updateCartCount();
