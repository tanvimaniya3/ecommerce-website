let params = new URLSearchParams(window.location.search);

let category = params.get("cat");

document.getElementById("catTitle").innerText = category;
document.getElementById("catName").innerText = category;

let allProducts = [];

fetch("/api/products")
.then(res => res.json())
.then(data => {

allProducts = data.filter(p => p.category == category);

document.getElementById("productCount").innerText = allProducts.length;

showProducts(allProducts);

});

function showProducts(products){

let grid = document.getElementById("productGrid");

grid.innerHTML = "";

products.forEach(p => {

grid.innerHTML += `

<div class="product">

<a href="product.html?id=${p._id}">
<img src="${p.image}">
<h4>${p.name}</h4>
</a>

<p>₹${p.price}</p>

<button onclick="addToCart('${p._id}')">Add to Cart</button>

</div>

`;

});

}

// 🔥 SORT
document.getElementById("sort").addEventListener("change",function(){

let value = this.value;

let sorted = [...allProducts];

if(value == "low"){
sorted.sort((a,b)=>a.price-b.price);
}

if(value == "high"){
sorted.sort((a,b)=>b.price-a.price);
}

showProducts(sorted);

});


// 🔥 ADD TO CART (ONLY ONE FUNCTION)
function addToCart(id){

fetch("/api/products")
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

localStorage.setItem("cart",JSON.stringify(cart));

alert("Product Added To Cart");

});

}