let allProducts = [];

// 🔥 LOAD PRODUCTS ON INITIALIZATION
fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
  .then(res => res.json())
  .then(data => {
    allProducts = data;

    // Saare sections ko data initialize karna
    showProducts(data);
    showBestSellers(data);
    showNewArrivals(data);
    showSaleProducts(data);
  })
  .catch(err => console.error("Error fetching items:", err));

// ==========================================================================
/* 🔥 PREMIUM MAIN PRODUCT GRID (IMAGE-LIKE SPEC FIXED) */
// ==========================================================================
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

// ==========================================================================
/* 🔥 ADD TO CART ENGINE (ULTRA SPEED CACHE FIX) */
// ==========================================================================
function addToCart(id) {
  let product = allProducts.find(p => p._id == id);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(p => p._id == id);

  if (existing) {
    existing.qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart 🛒 ✅");
  updateCartCount();
}

// ==========================================================================
/* 🔥 BEST SELLERS SLIDER LOGIC */
// ==========================================================================
let bestProducts = [];
let currentIndex = 0;

function showBestSellers(products) {
  let box = document.getElementById("bestSellerContainer");
  if (!box) return;

  bestProducts = products.filter(p => p.bestSeller === true);
  renderBestSellers();
}

function renderBestSellers() {
  let box = document.getElementById("bestSellerContainer");
  if (!box) return;
  box.innerHTML = "";

  let visible = bestProducts.slice(currentIndex, currentIndex + 4);

  visible.forEach((p, index) => {
    box.innerHTML += `
      <div class="product-card" style="${index === visible.length - 1 ? 'margin-right:0px;' : ''}" onclick="openProduct('${p._id}')">
        <img src="${p.image}">
        <p class="price">₹${p.offerPrice ? p.offerPrice : p.price}</p>
        <h3>${p.name}</h3>
        <div class="stars">⭐⭐⭐⭐☆</div>
      </div>
    `;
  });
}

function slideRight() {
  if (currentIndex + 4 < bestProducts.length) {
    currentIndex += 4;
    renderBestSellers();
  }
}

function slideLeft() {
  if (currentIndex - 4 >= 0) {
    currentIndex -= 4;
    renderBestSellers();
  }
}

// ==========================================================================
/* 🔥 NEW ARRIVALS MODULE SLIDER */
// ==========================================================================
let naProducts = [];
let naIndex = 0;

function showNewArrivals(products) {
  let box = document.getElementById("newArrivalsContainer");
  if (!box) return;

  naProducts = [...products].reverse();
  renderNA();
}

function renderNA() {
  let box = document.getElementById("newArrivalsContainer");
  if (!box) return;
  box.innerHTML = "";

  let visible = naProducts.slice(naIndex, naIndex + 5);

  visible.forEach(p => {
    box.innerHTML += `
      <div class="na-card" onclick="openProduct('${p._id}')">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p class="na-price">₹${p.offerPrice ? p.offerPrice : p.price}</p>
        <button>Add to Cart</button>
      </div>
    `;
  });
}

function slideNARight() {
  if (naIndex + 5 < naProducts.length) {
    naIndex += 5;
    renderNA();
  }
}

function slideNALeft() {
  if (naIndex - 5 >= 0) {
    naIndex -= 5;
    renderNA();
  }
}

// ==========================================================================
/* 🔥 SALE SECTIONS GRID MODULE */
// ==========================================================================
function showSaleProducts(products) {
  let box = document.getElementById("saleContainer");
  if (!box) return;

  box.innerHTML = "";
  let sale = products.filter(p => p.offerPrice && p.offerPrice < p.price);

  sale.forEach(p => {
    // Reusing structural premium definitions for exact parity
    box.innerHTML += `
      <div class="premium-card">
          <div class="premium-image">
              <span class="premium-badge badge-hot">SALE</span>
              <a href="product.html?id=${p._id}">
                <img src="${p.image}">
              </a>
          </div>
          <div class="premium-content">
              <h3>${p.name}</h3>
              <div class="premium-price">
                  <span class="new-price">₹${p.offerPrice}</span>
                  <span class="old-price">₹${p.price}</span>
                  <span class="off-box">${Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF</span>
              </div>
          </div>
      </div>
    `;
  });
}

// ==========================================================================
/* ⚙️ UTILITIES & ACCESSORY HANDLERS */
// ==========================================================================
function goToSale() { window.location.href = "products.html?sale=true"; }
function openProduct(id) { window.location.href = "product.html?id=" + id; }

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;
  cart.forEach(p => { count += p.qty || 1; });
  let cartBox = document.getElementById("cartCount");
  if (cartBox) cartBox.innerText = count;
}

function addToWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.includes(id)) {
    alert("Already in Wishlist ❤️");
    return;
  }
  wishlist.push(id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to Wishlist ❤️");
}

// SEARCH BAR INTERACTION
document.addEventListener("DOMContentLoaded", function () {
  let btn = document.getElementById("searchBtn");
  let box = document.getElementById("searchBox");

  if (btn && box) {
    btn.addEventListener("click", function () {
      if (box.style.display === "none" || box.style.display === "") {
        box.style.display = "block";
        box.focus();
      } else {
        box.style.display = "none";
      }
    });

    box.addEventListener("keyup", function (e) {
      if (e.key === "Enter" && box.value.length > 2) {
        window.location.href = "products.html?search=" + box.value;
      }
    });
  }
});

// ==========================================================================
/* 👥 USER MANAGEMENT & DROPDOWNS */
// ==========================================================================
function showUserStatus() {
  let user = JSON.parse(localStorage.getItem("user"));
  let area = document.getElementById("userArea");
  if (!area) return;

  if (user) {
    area.innerHTML = `
      <div style="position:relative; display:inline-block;">
        <button onclick="toggleUserMenu()" style="background:none; border:none; color:white; cursor:pointer; font-size:16px; font-weight:600;">
          👤 Hi ${user.name} ▾
        </button>
        <div id="userMenu" style="display:none; position:absolute; right:0; top:45px; background:white; min-width:190px; border-radius:14px; box-shadow:0 15px 35px rgba(0,0,0,0.18); overflow:hidden; z-index:999; opacity:0; transform:translateY(15px) scale(0.96); transition:0.35s ease;">
          <a href="profile.html" class="drop-item">👤 My Profile</a>
          <a href="my-orders.html" class="drop-item">📦 My Orders</a>
          <a href="wishlist.html" class="drop-item">❤️ Wishlist</a>
          <a href="#" onclick="logoutUser()" style="color:red;" class="drop-item">🚪 Logout</a>
        </div>
      </div>
    `;
    // Adding internal runtime drop styles
    let style = document.createElement('style');
    style.innerHTML = `.drop-item{display:block; padding:12px; color:black; text-decoration:none; transition:0.2s;} .drop-item:hover{background:#f5f5f5;}`;
    document.head.appendChild(style);
  } else {
    area.innerHTML = `
      <div class="account-menu">
        <a href="javascript:void(0)" onclick="toggleAccountMenu()" style="color:white; text-decoration:none;">👤 Account</a>
        <div id="accountDropdown" class="account-dropdown">
          <a href="login.html">Login</a>
          <a href="register.html">Register</a>
        </div>
      </div>
    `;
  }
}

function toggleAccountMenu() {
  let box = document.getElementById("accountDropdown");
  if (!box) return;
  box.style.display = box.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".account-menu")) {
    let box = document.getElementById("accountDropdown");
    if (box) box.style.display = "none";
  }
});

function logoutUser() {
  localStorage.removeItem("user");
  location.reload();
}

function toggleUserMenu() {
  let menu = document.getElementById("userMenu");
  if (!menu) return;

  if (menu.style.display === "block") {
    menu.style.opacity = "0";
    menu.style.transform = "translateY(15px) scale(0.96)";
    setTimeout(() => { menu.style.display = "none"; }, 300);
  } else {
    menu.style.display = "block";
    setTimeout(() => {
      menu.style.opacity = "1";
      menu.style.transform = "translateY(0) scale(1)";
    }, 20);
  }
}

document.addEventListener("click", function (e) {
  let menu = document.getElementById("userMenu");
  if (!menu) return;
  if (!e.target.closest("#userMenu") && !e.target.closest("button")) {
    menu.style.opacity = "0";
    menu.style.transform = "translateY(15px) scale(0.96)";
    setTimeout(() => { menu.style.display = "none"; }, 300);
  }
});

// Run commands on layout compile
showUserStatus();
updateCartCount();
