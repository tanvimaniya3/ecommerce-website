// 🔥 LOAD PRODUCTS
fetch("/api/products")
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
<img src="${p.image}" width="200">
<h3>${p.name}</h3>
</a>

<p>₹${p.price}</p>

<button onclick="addToCart('${p._id}')">Add to Cart</button>

</div>

`;

});

}


// 🔥 ADD TO CART (FINAL FIXED)
function addToCart(id){

fetch("/api/products")
.then(res => res.json())
.then(data => {

let product = data.find(p => p._id == id);

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// qty fix
cart.forEach(item=>{
if(!item.qty){
item.qty = 1;
}
});

let existing = cart.find(p => p._id == id);

if(existing){
existing.qty += 1;
}else{
product.qty = 1;
cart.push(product);
}

localStorage.setItem("cart", JSON.stringify(cart));

alert("Product Added To Cart");

// 🔥 cart count update
updateCartCount();

});

}


// 🔥 CART COUNT
function updateCartCount(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let count = 0;

cart.forEach(p=>{
count += p.qty || 1;
});

let cartBox = document.getElementById("cartCount");

if(cartBox){
cartBox.innerText = count;
}

}

// पहली बार load
updateCartCount();