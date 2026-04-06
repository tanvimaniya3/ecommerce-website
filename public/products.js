let allProducts = [];

// URL se search query lena
let params = new URLSearchParams(window.location.search);
let searchQuery = params.get("search");

// 🔥 LOAD PRODUCTS
fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {

allProducts = data;

// agar home se search aaya ho
if(searchQuery){
document.getElementById("searchInput").value = searchQuery;
}

applyFilters();

});


// 🔥 SHOW PRODUCTS
function showProducts(products){

let box = document.getElementById("productContainer");
if(!box) return;

box.innerHTML = "";

if(products.length === 0){
box.innerHTML = "<h3>No Product Found ❌</h3>";
return;
}

products.forEach(p => {

/* 🔥 HIDE LOGIC */
if(p.visible === false) return;

/* 🔥 PRICE LOGIC */
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

/* 🔥 STOCK LOGIC */
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


// 🔥 FILTERS
function applyFilters(){

let search = document.getElementById("searchInput").value.toLowerCase();
let category = document.getElementById("categoryFilter")?.value || "";
let price = document.getElementById("priceFilter")?.value || "";
let sort = document.getElementById("sortFilter")?.value || "";

let suggestionBox = document.getElementById("suggestions");

let filtered = allProducts.filter(p => {

if(p.visible === false) return false;

let matchSearch = p.name.toLowerCase().includes(search);
let matchCategory = category === "" || p.category === category;

let matchPrice = true;

let finalPrice = p.offerPrice || p.price;

if(price === "low"){
matchPrice = finalPrice < 500;
}
else if(price === "mid"){
matchPrice = finalPrice >= 500 && finalPrice <= 2000;
}
else if(price === "high"){
matchPrice = finalPrice > 2000;
}

return matchSearch && matchCategory && matchPrice;

});

// 🔃 SORT
if(sort === "low"){
filtered.sort((a,b)=> (a.offerPrice || a.price) - (b.offerPrice || b.price));
}
else if(sort === "high"){
filtered.sort((a,b)=> (b.offerPrice || b.price) - (a.offerPrice || a.price));
}

showProducts(filtered);


// 🔥 SUGGESTIONS
if(suggestionBox){
suggestionBox.innerHTML = "";

if(search.length > 0){

filtered.slice(0,5).forEach(p => {
suggestionBox.innerHTML += `
<div onclick="goToProduct('${p._id}')" 
style="padding:8px; cursor:pointer; border-bottom:1px solid #eee;">
${p.name}
</div>
`;
});

}

}

}


// 🔥 CLICK SUGGESTION
function goToProduct(id){
window.location.href = "product.html?id=" + id;
}


// 🔥 ADD TO CART
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
alert("Added to Cart ✅");

});

}
