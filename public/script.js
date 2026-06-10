fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
.then(res => res.json())
.then(data => {
showProducts(data);
showBestSellers(data);
showNewArrivals(data);
showSaleProducts(data);
});

function showProducts(products) {
  let box = document.getElementById("productContainer");
  if (!box) return;

  box.innerHTML = "";

  products.forEach(p => {
    if (p.visible === false) return;

    // 1. Image reference matching soft capsule badges
    let badgeHTML = "";
    if (p.bestSeller) {
      badgeHTML = `<span class="premium-badge badge-best">Best Seller</span>`;
    } else if (p.category && p.category.toLowerCase() === "lighting") {
      badgeHTML = `<span class="premium-badge badge-hot">Hot Deal</span>`;
    } else {
      badgeHTML = `<span class="premium-badge badge-new">New Arrival</span>`;
    }

    // 2. Exact match palette accent category buttons
    let btnClass = "btn-black";
    let catName = p.category ? p.category.toLowerCase() : "";
    if (catName === "furniture" || catName === "storage") {
      btnClass = "btn-olive";
    } else if (catName === "lighting" || catName === "appliances" || catName === "cookware") {
      btnClass = "btn-terracotta";
    }

    // 3. Render dynamic structural buttons (Outline Shopping Bag Icon SVG Added)
    let buttonHTML = "";
    let bagSvg = `
      <svg class="bag-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    `;

    if (p.stock === false) {
      buttonHTML = `<button class="btn-disabled" disabled><span>Out of Stock</span></button>`;
    } else {
      buttonHTML = `
        <button class="${btnClass}" onclick="addToCart('${p._id}')">
          <span>Add to Cart</span>
          ${bagSvg}
        </button>
      `;
    }

    // Circular profile outline heart SVG layout
    let heartSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    `;

    box.innerHTML += `
      <div class="premium-card">
          <div class="premium-image">
              ${badgeHTML}
              <span class="wishlist-btn" onclick="addToWishlist('${p._id}')">
                ${heartSvg}
              </span>
              <a href="product.html?id=${p._id}">
                <img src="${p.image}" alt="${p.name}">
              </a>
          </div>

          <div class="premium-content">
              <h3>${p.name}</h3>
              <p class="premium-category">${p.category || "Home Decor"}</p>
              
              <div class="premium-rating">
                ★★★★★ <span>(${catName === 'furniture' ? '96' : catName === 'lighting' ? '73' : '128'})</span>
              </div>

              <div class="premium-price">
                  <span class="new-price">₹${(p.offerPrice || p.price).toLocaleString('en-IN')}</span>
                  ${p.offerPrice && p.offerPrice < p.price ? `<span class="old-price">₹${p.price.toLocaleString('en-IN')}</span>` : ""}
                  ${p.offerPrice && p.offerPrice < p.price ? `<span class="off-box">${Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF</span>` : ""}
              </div>

              ${buttonHTML}
          </div>
      </div>
    `;
  });
}

function addToCart(id){
fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
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

localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to Cart");
updateCartCount();
});
}
let bestProducts = [];
let currentIndex = 0;

function showBestSellers(products) {
  let box = document.getElementById("bestSellerContainer");
  if (!box) return;

  // Filter only best seller products
  bestProducts = products.filter(p => p.bestSeller === true);

  /* Render first initial items */
  renderBestSellers();
}

function renderBestSellers() {
  let box = document.getElementById("bestSellerContainer");
  if (!box) return;
  box.innerHTML = "";

  // Original array se 4 items slice ho rahe hain
  let visible = bestProducts.slice(currentIndex, currentIndex + 4);

  visible.forEach(p => {
    let exactPrice = p.offerPrice ? p.offerPrice : p.price;
    
    // Sleek Shopping Bag Icon SVG
    let smallBagSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    `;

    // Note: stopPropagation() laga diya hai taaki Add to Cart dabaane par product detail page open na ho
    box.innerHTML += `
      <div class="mini-slider-card" onclick="openProduct('${p._id}')">
        
        <div class="mini-card-img-container">
          <img src="${p.image}" alt="${p.name}">
          
          <button class="hover-cart-btn" onclick="event.stopPropagation(); addToCart('${p._id}')">
            ${smallBagSvg}
            Add to Cart
          </button>
        </div>

        <h4>${p.name}</h4>
        <p class="mini-price">₹${exactPrice.toLocaleString('en-IN')}</p>
      </div>
    `;
  });
}
// Slider Movement Controller Mechanics
function slideRight() {
  if (currentIndex + 4 < bestProducts.length) {
    currentIndex += 4;
    renderBestSellers();
  } else {
    // Optional loop to start back at 0 if end is reached
    currentIndex = 0;
    renderBestSellers();
  }
}

function slideLeft() {
  if (currentIndex - 4 >= 0) {
    currentIndex -= 4;
    renderBestSellers();
  } else {
    // Optional loop to end if clicked left at start
    if (bestProducts.length > 4) {
      currentIndex = Math.floor((bestProducts.length - 1) / 4) * 4;
      renderBestSellers();
    }
  }
}
// 🔥 NEW ARRIVALS
// 🔥 NEW ARRIVALS STATE MANAGEMENT
let naProducts = [];
let naIndex = 0;

function showNewArrivals(products) {
  let box = document.getElementById("newArrivalsContainer");
  if (!box) return;

  // 1. Array ko reverse karke bilkul latest upload hui products ko pehle laya
  let sortedLatest = [...products].reverse();

  // 2. SLICE EXACTLY 9 ITEMS: Taaki database mein chahe 50 items ho, humein sirf top 9 new items milen
  naProducts = sortedLatest.slice(0, 9);

  /* Render first loop cluster */
  renderNA();
}

function renderNA() {
  let box = document.getElementById("newArrivalsContainer");
  if (!box) return;
  box.innerHTML = "";

  // Slider horizontal view logic (Ek baar mein screen par 4 products dikhenge)
  let visible = naProducts.slice(naIndex, naIndex + 3);

  visible.forEach(p => {
    let exactPrice = p.offerPrice ? p.offerPrice : p.price;
    
    // Shopping Bag Vector SVG Icon
    let smallBagSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    `;

    box.innerHTML += `
      <div class="na-slider-card" onclick="openProduct('${p._id}')">
        
        <div class="na-card-img-container">
          <img src="${p.image}" alt="${p.name}">
          
          <button class="na-hover-cart-btn" onclick="event.stopPropagation(); addToCart('${p._id}')">
            ${smallBagSvg}
            Add to Cart
          </button>
        </div>

        <h3>${p.name}</h3>
        <p class="na-price">₹${exactPrice.toLocaleString('en-IN')}</p>
      </div>
    `;
  });
}

// SLIDER MOVEMENT ENGINE CONTROLLERS FOR 9 ITEMS MAX LIMIT
function slideNARight() {
  // Agar next clique par 4 elements available hain, tabhi slide hoga
  if (naIndex + 3 < naProducts.length) {
    naIndex += 3;
    renderNA();
  } else {
    // Agar loop end par aagya hai, toh wapas first product standard index (0) par push karega
    naIndex = 0;
    renderNA();
  }
}

function slideNALeft() {
  if (naIndex - 3 >= 0) {
    naIndex -= 3;
    renderNA();
  } else {
    // Agar shuruat mein left click kiya, toh automatic loop end index par transfer kar dega (Since limit is 9, last cluster starts at index 8)
    naIndex = 9;
    renderNA();
  }
}
// 🔥 SALE PRODUCTS
function showSaleProducts(products){
let box = document.getElementById("saleContainer");
if(!box) return;

box.innerHTML = "";

/* only discounted */
let sale = products.filter(p => p.offerPrice && p.offerPrice < p.price);

sale.forEach(p => {
box.innerHTML += `
<div class="product">

<a href="product.html?id=${p._id}">
<img src="${p.image}">
<h3>${p.name}</h3>
</a>

<p>
<span class="old">₹${p.price}</span>
<span class="new">₹${p.offerPrice}</span>
</p>

<p class="off">
🔥 ${Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF
</p>

</div>
`;
});
}

// 🔥 OFFER BUTTON CLICK
function goToSale(){
window.location.href = "products.html?sale=true";
}

function openProduct(id){
window.location.href = "product.html?id=" + id;
}

function updateCartCount(){
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let count = 0;

cart.forEach(p=>{
count += p.qty || 1;
});

let cartBox = document.getElementById("cartCount");
if(cartBox) cartBox.innerText = count;
}


// 🔥 FINAL SEARCH FIX (ONLY THIS USED)
document.addEventListener("DOMContentLoaded", function(){

let btn = document.getElementById("searchBtn");
let box = document.getElementById("searchBox");

if(btn && box){

btn.addEventListener("click", function(){

if(box.style.display === "none" || box.style.display === ""){
box.style.display = "block";
box.focus();
}else{
box.style.display = "none";
}

});

box.addEventListener("keyup", function(e){
if(e.key === "Enter" && box.value.length > 2){
window.location.href = "products.html?search=" + box.value;
}
});

}

});

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
function showUserStatus(){

let user = JSON.parse(localStorage.getItem("user"));
let area = document.getElementById("userArea");

if(!area) return;

if(user){

area.innerHTML = `
<div style="position:relative; display:inline-block;">

<button onclick="toggleUserMenu()" style="
background:none;
border:none;
color:white;
cursor:pointer;
font-size:16px;
font-weight:600;
">
👤 Hi ${user.name} ▾
</button>

<div id="userMenu" style="
display:none;
position:absolute;
right:0;
top:45px;
background:white;
min-width:190px;
border-radius:14px;
box-shadow:0 15px 35px rgba(0,0,0,0.18);
overflow:hidden;
z-index:999;
opacity:0;
transform:translateY(15px) scale(0.96);
transition:0.35s ease;
">

<a href="profile.html" style="display:block;padding:12px;color:black;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#f5f5f5'"
onmouseout="this.style.background='white'">👤 My Profile</a>

<a href="my-orders.html" style="display:block;padding:12px;color:black;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#f5f5f5'"
onmouseout="this.style.background='white'">📦 My Orders</a>

<a href="wishlist.html" style="display:block;padding:12px;color:black;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#f5f5f5'"
onmouseout="this.style.background='white'">❤️ Wishlist</a>

<a href="#" onclick="logoutUser()" style="display:block;padding:12px;color:red;text-decoration:none;transition:0.3s;"
onmouseover="this.style.background='#fff0f0'"
onmouseout="this.style.background='white'">🚪 Logout</a>

</div>

</div>
`;

}else{

area.innerHTML = `
<div class="account-menu">

<a href="javascript:void(0)" onclick="toggleAccountMenu()" style="color:white;text-decoration:none;">
👤 Account
</a>

<div id="accountDropdown" class="account-dropdown">

<a href="login.html">Login</a>
<a href="register.html">Register</a>

</div>

</div>
`;

}

}
function toggleAccountMenu(){

let box = document.getElementById("accountDropdown");

if(box.style.display=="block"){
box.style.display="none";
}else{
box.style.display="block";
}

}

document.addEventListener("click",function(e){

if(!e.target.closest(".account-menu")){

let box = document.getElementById("accountDropdown");

if(box) box.style.display="none";

}

});

function logoutUser(){
localStorage.removeItem("user");
location.reload();
}
function toggleUserMenu(){

let menu = document.getElementById("userMenu");

if(menu.style.display === "block"){

menu.style.opacity = "0";
menu.style.transform = "translateY(15px) scale(0.96)";

setTimeout(()=>{
menu.style.display = "none";
},300);

}else{

menu.style.display = "block";

setTimeout(()=>{
menu.style.opacity = "1";
menu.style.transform = "translateY(0) scale(1)";
},20);

}

}
document.addEventListener("click", function(e){

let menu = document.getElementById("userMenu");

if(!menu) return;

if(!e.target.closest("#userMenu") && !e.target.closest("button")){

menu.style.opacity = "0";
menu.style.transform = "translateY(15px) scale(0.96)";

setTimeout(()=>{
menu.style.display = "none";
},300);

}

});
showUserStatus();
updateCartCount();
