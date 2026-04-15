let params = new URLSearchParams(window.location.search);
let id = params.get("id");

let productData = null;
let quantity = 1;

fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res=>res.json())
.then(data=>{

let product = data.find(p => p._id == id);
productData = product;

// IMAGE
let img = product.image 
? (product.image.startsWith("http") 
    ? product.image 
    : "https://ecommerce-website-1-psvr.onrender.com" + product.image)
: "https://via.placeholder.com/400";

document.getElementById("pImage").src = img;

// 🔥 EXTRA IMAGES SHOW
let extraBox = document.getElementById("extraImages");
extraBox.innerHTML = "";

if(product.images && product.images.length > 0){

product.images.forEach(img => {

let finalImg = img.startsWith("http") 
? img 
: "https://ecommerce-website-1-psvr.onrender.com" + img;

extraBox.innerHTML += `
<img src="${finalImg}" width="70" style="cursor:pointer; border:1px solid #ccc; padding:5px;"
onclick="changeImage('${finalImg}')">
`;

});

}    
    

// NAME
document.getElementById("pName").innerText = product.name;

// PRICE + DISCOUNT
let priceBox = document.getElementById("priceBox");

if(product.offerPrice && product.offerPrice < product.price){

let percent = Math.round(((product.price - product.offerPrice) / product.price) * 100);

priceBox.innerHTML = `
<span class="old">₹${product.price}</span>
<span class="new">₹${product.offerPrice}</span>
<span class="off">(${percent}% OFF)</span>
`;

}else{
priceBox.innerHTML = `<span class="new">₹${product.price}</span>`;
}

// STOCK
let stockText = document.getElementById("stockStatus");

if(product.stock === false){
stockText.innerHTML = "❌ Out of Stock";
stockText.style.color = "red";

document.getElementById("cartBtn").disabled = true;
document.getElementById("buyBtn").disabled = true;

}else{
stockText.innerHTML = "✅ In Stock";
stockText.style.color = "green";
}

// DESCRIPTION
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

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(p => p._id == productData._id);

if(existing){
existing.qty += quantity;
}else{
productData.qty = quantity;
cart.push(productData);
}

localStorage.setItem("cart", JSON.stringify(cart));

alert("Added to Cart ✅");
updateCartCount();
}

// BUY NOW
function buyNow(){

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
if(badge) badge.innerText = count;
}

// new option error aye to
function changeImage(src){
document.getElementById("pImage").src = src;
}
