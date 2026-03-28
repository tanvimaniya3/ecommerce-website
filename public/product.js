let params = new URLSearchParams(window.location.search);
let id = params.get("id");

let productData = null;
let quantity = 1;

fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res=>res.json())
.then(data=>{

let product = data.find(p => p._id == id);

if(!product){
alert("Product nahi mila ❌");
return;
}

productData = product;

document.getElementById("pImage").src =
"https://ecommerce-website-pmr7.onrender.com" + product.image;

document.getElementById("pName").innerText = product.name;
document.getElementById("pPrice").innerText = "₹" + product.price;
document.getElementById("pDesc").innerText = product.description || "";

updateCartCount();

});

// QTY
function increaseQty(){
quantity++;
document.getElementById("qty").innerText = quantity;
}

function decreaseQty(){
if(quantity > 1){
quantity--;
document.getElementById("qty").innerText = quantity;
}
}

// ADD TO CART
function addToCart(){

if(!productData){
alert("Product load nahi hua ❌");
return;
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(p => p._id == productData._id);

if(existing){
existing.qty += quantity;
}else{
productData.qty = quantity;
cart.push(productData);
}

localStorage.setItem("cart", JSON.stringify(cart));

alert("Added to Cart");

updateCartCount();
}

// BUY NOW
function buyNow(){

if(!productData){
alert("Product load nahi hua ❌");
return;
}

let cart = [];

productData.qty = quantity;

cart.push(productData);

localStorage.setItem("cart", JSON.stringify(cart));

window.location.href = "checkout.html";
}

// CART COUNT
function updateCartCount(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let count = 0;

cart.forEach(p=>{
count += p.qty || 1;
});

let badge = document.getElementById("cartCount");

if(badge){
badge.innerText = count;
}

}