let allProducts = [];

let params = new URLSearchParams(window.location.search);
let searchQuery = params.get("search");

fetch("https://ecommerce-website-1-s0j9.onrender.com/api/products")
.then(res => res.json())
.then(data => {

allProducts = data;

if(searchQuery){
let filtered = data.filter(p =>
p.name.toLowerCase().includes(searchQuery.toLowerCase())
);
showProducts(filtered);
}else{
showProducts(data);
}

});

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
<img src="https://ecommerce-website-1-s0j9.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>
<p>₹${p.price}</p>
</div>
`;
});
}

function searchProduct(){
let input = document.getElementById("searchInput").value.toLowerCase();

let filtered = allProducts.filter(p =>
p.name.toLowerCase().includes(input)
);

showProducts(filtered);
}
