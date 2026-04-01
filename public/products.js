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

box.innerHTML += `
<div class="product">

<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>

<p>₹${p.price}</p>

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

let matchCategory = category === "" || p.category === category;

let matchPrice = true;

if(price === "low"){
matchPrice = p.price < 500;
}
else if(price === "mid"){
matchPrice = p.price >= 500 && p.price <= 2000;
}
else if(price === "high"){
matchPrice = p.price > 2000;
}

return matchSearch && matchCategory && matchPrice;

});

// 🔃 SORT
if(sort === "low"){
filtered.sort((a,b)=> a.price - b.price);
}
else if(sort === "high"){
filtered.sort((a,b)=> b.price - a.price);
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
