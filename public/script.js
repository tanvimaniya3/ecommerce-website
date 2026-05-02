fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {
showProducts(data);
showBestSellers(data);
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
function showBestSellers(products){

let box = document.getElementById("bestSellerContainer");
if(!box) return;

box.innerHTML = "";

/* 🔥 ONLY BEST SELLER PRODUCTS */
let best = products.filter(p => p.bestSeller);

if(best.length === 0){
  // fallback (agar old product me field na ho)
  best = products.slice(0,4);
}

best.forEach(p => {

box.innerHTML += `
<div class="product-card" onclick="openProduct('${p._id}')">

<img src="${p.image}">

<p class="price">
₹${p.offerPrice ? p.offerPrice : p.price}
</p>

<h3>${p.name}</h3>

<div class="stars">⭐⭐⭐⭐☆</div>

</div>
`;

});
}
function slideLeft(){
document.getElementById("bestSellerContainer").scrollLeft -= 300;
}

function slideRight(){
document.getElementById("bestSellerContainer").scrollLeft += 300;
}

function openProduct(id){
window.location.href = "product.html?id=" + id;
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
function showUserStatus(){

let user = JSON.parse(localStorage.getItem("user"));
let area = document.getElementById("userArea");

if(!area) return;

if(user){

area.innerHTML = `
<div style="position:relative; display:inline-block;">

<button onclick="toggleUserMenu()" style="
background:none;
border:none;
color:white;
cursor:pointer;
font-size:16px;
font-weight:600;
">
👤 Hi ${user.name} ▾
</button>

<div id="userMenu" style="
display:none;
position:absolute;
right:0;
top:45px;
background:white;
min-width:190px;
border-radius:14px;
box-shadow:0 15px 35px rgba(0,0,0,0.18);
overflow:hidden;
z-index:999;
opacity:0;
transform:translateY(15px) scale(0.96);
transition:0.35s ease;
">

<a href="profile.html" style="display:block;padding:12px;color:black;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#f5f5f5'"
onmouseout="this.style.background='white'">👤 My Profile</a>

<a href="my-orders.html" style="display:block;padding:12px;color:black;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#f5f5f5'"
onmouseout="this.style.background='white'">📦 My Orders</a>

<a href="wishlist.html" style="display:block;padding:12px;color:black;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#f5f5f5'"
onmouseout="this.style.background='white'">❤️ Wishlist</a>

<a href="#" onclick="logoutUser()" style="display:block;padding:12px;color:red;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#fff0f0'"
onmouseout="this.style.background='white'">🚪 Logout</a>

</div>

</div>
`;

}else{

area.innerHTML = `
<div class="account-menu">

<a href="javascript:void(0)" onclick="toggleAccountMenu()" style="color:white;text-decoration:none;">
👤 Account
</a>

<div id="accountDropdown" class="account-dropdown">

<a href="login.html">Login</a>
<a href="register.html">Register</a>

</div>

</div>
`;

}

}
function toggleAccountMenu(){

let box = document.getElementById("accountDropdown");

if(box.style.display=="block"){
box.style.display="none";
}else{
box.style.display="block";
}

}

document.addEventListener("click",function(e){

if(!e.target.closest(".account-menu")){

let box = document.getElementById("accountDropdown");

if(box) box.style.display="none";

}

});

function logoutUser(){
localStorage.removeItem("user");
location.reload();
}
function toggleUserMenu(){

let menu = document.getElementById("userMenu");

if(menu.style.display === "block"){

menu.style.opacity = "0";
menu.style.transform = "translateY(15px) scale(0.96)";

setTimeout(()=>{
menu.style.display = "none";
},300);

}else{

menu.style.display = "block";

setTimeout(()=>{
menu.style.opacity = "1";
menu.style.transform = "translateY(0) scale(1)";
},20);

}

}
document.addEventListener("click", function(e){

let menu = document.getElementById("userMenu");

if(!menu) return;

if(!e.target.closest("#userMenu") && !e.target.closest("button")){

menu.style.opacity = "0";
menu.style.transform = "translateY(15px) scale(0.96)";

setTimeout(()=>{
menu.style.display = "none";
},300);

}

});
showUserStatus();
updateCartCount();
