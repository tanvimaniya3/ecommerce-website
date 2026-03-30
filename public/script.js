// 🔥 LOAD PRODUCTS (FINAL FIXED)
fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res => res.json())
.then(data => {
console.log("DATA:", data); // debug
showProducts(data);
})
.catch(err => {
console.log("FETCH ERROR:", err);
alert("Products load nahi ho rahe ❌");
});


// 🔥 SHOW PRODUCTS
function showProducts(products){

let box = document.getElementById("productContainer");

// 👉 अगर div नहीं मिला
if(!box){
console.log("productContainer nahi mila ❌");
return;
}

box.innerHTML = "";

// 👉 अगर data empty है
if(!products || products.length === 0){
box.innerHTML = "<h3>No products found ❌</h3>";
return;
}

products.forEach(p => {

box.innerHTML += `
<div class="product">

<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-pmr7.onrender.com/${p.image}" width="200">
<h3>${p.name}</h3>
</a>

<p>₹${p.price}</p>

<button onclick="addToCart('${p._id}')">Add to Cart</button>

</div>
`;

});

}


// 🔥 ADD TO CART
function addToCart(id){

fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res => res.json())
.then(data => {

let product = data.find(p => p._id == id);

if(!product){
alert("Product nahi mila ❌");
return;
}

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

updateCartCount();

})
.catch(err=>{
console.log("CART ERROR:", err);
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

// 🔍 show/hide search
function toggleSearch(){
let box = document.getElementById("searchBox");

if(box.style.display === "none"){
box.style.display = "inline-block";
}else{
box.style.display = "none";
}
}

// 🔍 search redirect
function searchFromHome(){

let value = document.getElementById("searchBox").value;

if(value.length > 2){
window.location.href = "products.html?search=" + value;
}

}

// पहली बार load
updateCartCount();
