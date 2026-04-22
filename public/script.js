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

<span class="wish-btn" onclick="addToWishlist('${p._id}')">❤️</span>

<a href="product.html?id=${p._id}">
<img src="${p.image}">
<h3>${p.name}</h3>
</a>

${
p.offerPrice && p.offerPrice < p.price
? `
<p>
<span class="old">₹${p.price}</span>
<span class="new">₹${p.offerPrice}</span>
</p>

<p class="off">
🔥 ${Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF
</p>
`
: `<p class="new">₹${p.price}</p>`
}

${
p.stock === false
? `<button class="disabled">Out of Stock</button>`
: `<button onclick="addToCart('${p._id}')">Add to Cart</button>`
}

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

function addToWishlist(id){

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let exists = wishlist.find(item => item == id);

if(exists){
alert("Already in Wishlist ❤️");
return;
}

wishlist.push(id);

localStorage.setItem("wishlist", JSON.stringify(wishlist));

alert("Added to Wishlist ❤️");
}
updateCartCount();
