let params = new URLSearchParams(window.location.search);
let id = params.get("id");

let productData = null;
let quantity = 1;

// 🔥 load product
async function loadProduct(){

let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/products/" + id);
let p = await res.json();

productData = p;

// TEXT
document.getElementById("pName").innerText = p.name;
document.getElementById("pPrice").innerText = "₹" + p.price;
document.getElementById("pDesc").innerText = p.description || "No Description";

// 🔥 IMAGE FIX
document.getElementById("mainImage").src =
"https://ecommerce-website-pmr7.onrender.com/" + p.image;

// 🔥 GALLERY
let gallery = document.getElementById("gallery");
gallery.innerHTML = "";

if(p.images){
p.images.forEach(img=>{
let fullImg = "https://ecommerce-website-pmr7.onrender.com/" + img;

gallery.innerHTML += `
<img src="${fullImg}" width="80" onclick="changeImage('${fullImg}')">
`;
});
}

}

// 🔥 change image
function changeImage(src){
document.getElementById("mainImage").src = src;
}

// 🔥 quantity +
function increaseQty(){
quantity++;
document.getElementById("qty").innerText = quantity;
}

// 🔥 quantity -
function decreaseQty(){
if(quantity > 1){
quantity--;
document.getElementById("qty").innerText = quantity;
}
}

// 🔥 add to cart
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

alert("Added to Cart");

updateCartCount();

}

// 🔥 BUY NOW
function buyNow(){

let cart = [];

productData.qty = quantity;

cart.push(productData);

localStorage.setItem("cart", JSON.stringify(cart));

// 👉 direct checkout page
window.location.href = "checkout.html";

}

// 🔥 cart count
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

// start
loadProduct();
updateCartCount();
