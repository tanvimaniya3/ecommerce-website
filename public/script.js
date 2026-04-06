fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {

  let visibleProducts = data.filter(p => p.visible !== false);

  showProducts(visibleProducts);

});

function showProducts(products){
let box = document.getElementById("productContainer");
if(!box) return;

box.innerHTML = "";

products.forEach(p => {

/* 🔥 PRICE */
let priceHTML = "";

if(p.offerPrice){
let percent = Math.round(((p.price - p.offerPrice) / p.price) * 100);

priceHTML = `
<p>
<span style="text-decoration:line-through;">₹${p.price}</span>
<b style="color:green;"> ₹${p.offerPrice}</b>
</p>
<p style="color:red;">🔥 ${percent}% OFF</p>
`;
}else{
priceHTML = `<p>₹${p.price}</p>`;
}

/* 🔥 STOCK */
let stockHTML = "";

if(p.stock === false){
stockHTML = `<p style="color:red;">Out of Stock ❌</p>`;
}else{
stockHTML = `<button onclick="addToCart('${p._id}')">Add to Cart</button>`;
}

box.innerHTML += `
<div class="product">
<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>

${priceHTML}
${stockHTML}

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

document.addEventListener("DOMContentLoaded", function(){

let btn = document.getElementById("searchBtn");
let box = document.getElementById("searchBox");

if(btn && box){

btn.addEventListener("click", function(){

if(box.style.display === "none" || box.style.display === ""){
box.style.display = "block";
box.focus();
}else{
box.style.display = "none";
}

});

box.addEventListener("keyup", function(e){
if(e.key === "Enter" && box.value.length > 2){
window.location.href = "products.html?search=" + box.value;
}
});

}

});

updateCartCount();
