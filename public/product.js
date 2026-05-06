let params = new URLSearchParams(window.location.search);
let id = params.get("id");

let productData = null;
let quantity = 1;

fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {

let product = data.find(p => p._id == id);
productData = product;

/* ================= IMAGE ================= */

let mainImg = product.image 
? (product.image.startsWith("http") 
    ? product.image 
    : "https://ecommerce-website-1-psvr.onrender.com" + product.image)
: "https://via.placeholder.com/400";

/* 🔥 FIX: HTML ke id match karo */
document.getElementById("mainImage").src = mainImg;

/* ================= THUMB IMAGES ================= */

let thumbBox = document.getElementById("thumbContainer");
thumbBox.innerHTML = "";

let allImages = [];

/* main image */
if(product.image){
  allImages.push(product.image);
}

/* extra images */
if(product.images && product.images.length > 0){
  product.images.forEach(img => {
    if(img && img.trim() !== ""){
      allImages.push(img.trim());
    }
  });
}

/* remove duplicate */
allImages = [...new Set(allImages)];

allImages.forEach(img => {

let finalImg = img.startsWith("http") 
? img 
: "https://ecommerce-website-1-psvr.onrender.com" + img;

thumbBox.innerHTML += `
<img src="${finalImg}" onclick="changeImage('${finalImg}')">
`;

});

/* ================= NAME ================= */
document.getElementById("name").innerText = product.name;

/* ================= PRICE ================= */
let priceBox = document.getElementById("price");

if(product.offerPrice && product.offerPrice < product.price){

let percent = Math.round(((product.price - product.offerPrice) / product.price) * 100);

priceBox.innerHTML = `
<span style="text-decoration:line-through;color:gray;">₹${product.price}</span>
<span style="color:#b38b6d;font-size:22px;margin-left:10px;">₹${product.offerPrice}</span>
`;

document.getElementById("offer").innerText = `${percent}% OFF`;

}else{
priceBox.innerHTML = `₹${product.price}`;
document.getElementById("offer").innerText = "";
}

/* ================= DESCRIPTION ================= */
document.getElementById("desc").innerText = product.description || "No description available";

/* ================= BUTTONS ================= */

let cartBtn = document.querySelector(".cart-btn");
let wishBtn = document.querySelector(".wish-btn");

/* OUT OF STOCK */
if(product.stock === false){

cartBtn.innerText = "Out of Stock";
cartBtn.disabled = true;
cartBtn.style.background = "gray";

}else{

cartBtn.onclick = addToCart;

}

/* wishlist */
wishBtn.onclick = () => addToWishlist(product._id);

updateCartCount();

});

/* ================= CHANGE IMAGE ================= */

function changeImage(src){
document.getElementById("mainImage").src = src;
}

/* ================= QTY ================= */

function changeQty(val){

quantity += val;

if(quantity < 1) quantity = 1;

document.getElementById("qty").innerText = quantity;

}

/* ================= ADD TO CART ================= */

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

/* ================= WISHLIST ================= */

function addToWishlist(id){

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let exists = wishlist.find(item => item == id);

if(exists){
alert("Already in Wishlist ❤️");
return;
}

wishlist.push(id);
localStorage.setItem("wishlist", JSON.stringify(wishlist));

alert("Added to Wishlist ❤️");

}

/* ================= CART COUNT ================= */

function updateCartCount(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let count = 0;

cart.forEach(p=>{
count += p.qty || 1;
});

let badge = document.getElementById("cartCount");
if(badge) badge.innerText = count;

}

/* ================= TABS ================= */

function showTab(id){

document.querySelectorAll(".tab-content").forEach(tab=>{
tab.classList.remove("active");
});

document.getElementById(id).classList.add("active");

}
