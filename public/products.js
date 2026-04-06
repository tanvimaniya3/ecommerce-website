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


// 🔥 SHOW PRODUCTS (UPDATED WITH OFFER)
function showProducts(products){

let box = document.getElementById("productContainer");
if(!box) return;

box.innerHTML = "";

if(products.length === 0){
box.innerHTML = "<h3>No Product Found ❌</h3>";
return;
}

products.forEach(p => {

let discount = "";

if(p.offerPrice){
let percent = Math.round(((p.price - p.offerPrice) / p.price) * 100);
discount = `<span style="color:green;">(${percent}% OFF)</span>`;
}

box.innerHTML += `
<div class="product">

<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>

${p.offerPrice ? `
<p>
<span style="text-decoration:line-through; color:gray;">₹${p.price}</span>
<b style="color:red;"> ₹${p.offerPrice}</b>
${discount}
</p>
` 
: 
`<p>₹${p.price}</p>`}

</div>
`;

});

}


// 🔥 ALL FILTERS + SEARCH + SORT
function applyFilters(){

let search = document.getElementById("searchInput").value.toLowerCase();
let category = document.getElementById("categoryFilter")?.value || "";
let price = document.getElementById("priceFilter")?.value || "";
let sort = document.getElementById("sortFilter")?.value || "";

let suggestionBox = document.getElementById("suggestions");

// 🔍 FILTER LOGIC
let filtered = allProducts.filter(p => {

let matchSearch = p.name.toLowerCase().includes(search);

// 🔥 FIXED CATEGORY MATCH
let matchCategory = category === "" || 
(p.category && p.category.toLowerCase().trim() === category.toLowerCase().trim());

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

// show products
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
