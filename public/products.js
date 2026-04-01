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
let filtered = data.filter(p =>
p.name.toLowerCase().includes(searchQuery.toLowerCase())
);
showProducts(filtered);
}else{
showProducts(data);
}

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


// 🔍 🔥 ADVANCED SEARCH + SUGGESTIONS
function searchProduct(){

let input = document.getElementById("searchInput").value.toLowerCase();
let suggestionBox = document.getElementById("suggestions");

// filter products
let filtered = allProducts.filter(p =>
p.name.toLowerCase().includes(input)
);

showProducts(filtered);

// 🔥 suggestions
suggestionBox.innerHTML = "";

if(input.length === 0){
suggestionBox.innerHTML = "";
return;
}

filtered.slice(0,5).forEach(p => {
suggestionBox.innerHTML += `
<div onclick="goToProduct('${p._id}')" style="padding:8px; cursor:pointer; border-bottom:1px solid #eee;">
${p.name}
</div>
`;
});

}


// 🔥 CLICK SUGGESTION
function goToProduct(id){
window.location.href = "product.html?id=" + id;
}
