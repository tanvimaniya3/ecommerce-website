let params = new URLSearchParams(window.location.search);
let id = params.get("id");

let productData = null;
let quantity = 1;

fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res=>res.json())
.then(data=>{

let product = data.find(p => p._id == id);
productData = product;

/* IMAGE FIX */
let img = product.image?.startsWith("http")
? product.image
: "https://ecommerce-website-1-psvr.onrender.com" + product.image;

document.getElementById("pImage").src = img;

/* THUMB */
let extraBox = document.getElementById("extraImages");
extraBox.innerHTML = "";

let allImages = [product.image, ...(product.images || [])];

allImages = [...new Set(allImages)];

allImages.forEach(img => {

let finalImg = img.startsWith("http")
? img
: "https://ecommerce-website-1-psvr.onrender.com" + img;

extraBox.innerHTML += `
<img src="${finalImg}" onclick="changeImage('${finalImg}')">
`;
});

/* NAME */
document.getElementById("pName").innerText = product.name;

/* PRICE */
let priceBox = document.getElementById("priceBox");

if(product.offerPrice){
priceBox.innerHTML = `
<span class="old">₹${product.price}</span>
<span class="new">₹${product.offerPrice}</span>
`;
}else{
priceBox.innerHTML = `<span class="new">₹${product.price}</span>`;
}

/* DESC */
document.getElementById("pDesc").innerText = product.description || "";

});

/* IMAGE CHANGE */
function changeImage(src){
document.getElementById("pImage").src = src;
}

/* QTY */
function increaseQty(){
quantity++;
document.getElementById("qty").innerText = quantity;
}

function decreaseQty(){
if(quantity>1){
quantity--;
document.getElementById("qty").innerText = quantity;
}
}

/* CART */
function addToCart(){
alert("Added to Cart ✅");
}

/* TAB */
function showTab(id){
document.querySelectorAll(".pd-tab").forEach(t=>t.classList.remove("active"));
document.getElementById(id).classList.add("active");
}
