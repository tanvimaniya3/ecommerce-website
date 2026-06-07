// 🔥 GLOBAL VARIABLE: Isme saare products save rahenge taaki baar-baar fetch na karna pade
let allProducts = [];

// Page load hote hi data fetch karega
fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
  .then(res => res.json())
  .then(data => {
    allProducts = data; // Data ko global variable mein save kiya ✅
    showProducts(data);
    showBestSellers(data);
  })
  .catch(err => console.error("Error fetching products:", err));

// ===== SHOW PRODUCTS =====
function showProducts(products) {
  let box = document.getElementById("productContainer");
  if (!box) return;

  box.innerHTML = "";

  products.forEach(p => {
    box.innerHTML += `
      <div class="product">
        <span class="wish-btn" onclick="addToWishlist('${p._id}')">❤️</span>
        <a href="product.html?id=${p._id}">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
        </a>
        ${
          p.offerPrice && p.offerPrice < p.price
            ? `<p><span class="old">₹${p.price}</span><span class="new">₹${p.offerPrice}</span></p>
               <p class="off">🔥 ${Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF</p>`
            : `<p class="new">₹${p.price}</p>`
        }
        ${
          p.stock === false
            ? `<button class="disabled" disabled>Out of Stock</button>`
            : `<button onclick="addToCart('${p._id}')">Add to Cart</button>`
        }
      </div>
    `;
  });
}

// ===== ADD TO CART (⚡ FIXED & OPTIMIZED) =====
function addToCart(id) {
  // Ab yahan koi fetch call nahi hogi, seedhe memory se product milega!
  let product = allProducts.find(p => p._id == id);
  
  if (!product) {
    alert("Product not found! ❌");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(item => item._id == id);

  if (existing) {
    existing.qty += 1;
  } else {
    // Original product object ko mutate hone se bachane ke liye copy banayi
    let cartItem = { ...product, qty: 1 };
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart 🛒");
  updateCartCount();
}

// ===== SHOW BEST SELLERS =====
function showBestSellers(products) {
  let box = document.getElementById("bestSellerContainer");
  if (!box) return;

  box.innerHTML = "";
  let best = products.filter(p => p.bestSeller === true);

  best.forEach(p => {
    box.innerHTML += `
      <div class="product-card" onclick="openProduct('${p._id}')">
        <img src="${p.image}" alt="${p.name}">
        ${
          p.offerPrice && p.offerPrice < p.price
            ? `<p class="price"><span style="text-decoration:line-through; color:gray; font-size:13px;">₹${p.price}</span> ₹${p.offerPrice}</p>`
            : `<p class="price">₹${p.price}</p>`
        }
        <h3>${p.name}</h3>
        <div class="stars">⭐⭐⭐⭐☆</div>
      </div>
    `;
  });
}

// ===== SLIDER FUNCTIONS =====
function slideLeft() {
  let container = document.getElementById("bestSellerContainer");
  if (container) container.scrollLeft -= 300;
}

function slideRight() {
  let container = document.getElementById("bestSellerContainer");
  if (container) container.scrollLeft += 300;
}

function openProduct(id) {
  window.location.href = "product.html?id=" + id;
}

// ===== CART COUNT =====
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;

  cart.forEach(p => {
    count += p.qty || 1;
  });

  let cartBox = document.getElementById("cartCount");
  if (cartBox) cartBox.innerText = count;
}

// ===== SEARCH INITIALIZATION =====
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
        window.location.href = "products.html?search=" + encodeURIComponent(box.value);
      }
    });
  }
});

// ===== WISHLIST =====
function addToWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let exists = wishlist.find(item => item == id);

  if (exists) {
    alert("Already in Wishlist ❤️");
    return;
  }

  wishlist.push(id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to Wishlist ❤️");
}

// ===== USER STATUS & MENUS =====
function showUserStatus() {
  let user = JSON.parse(localStorage.getItem("user"));
  let area = document.getElementById("userArea");

  if (!area) return;

  if (user) {
    area.innerHTML = `
      <div style="position:relative; display:inline-block;" class="user-menu-container">
        <button onclick="toggleUserMenu()" style="background:none; border:none; color:white; cursor:pointer; font-size:16px; font-weight:600;">
          👤 Hi ${user.name} ▾
        </button>
        <div id="userMenu" style="display:none; position:absolute; right:0; top:45px; background:white; min-width:190px; border-radius:14px; box-shadow:0 15px 35px rgba(0,0,0,0.18); overflow:hidden; z-index:999; opacity:0; transform:translateY(15px) scale(0.96); transition:0.35s ease;">
          <a href="profile.html" class="menu-item">👤 My Profile</a>
          <a href="my-orders.html" class="menu-item">📦 My Orders</a>
          <a href="wishlist.html" class="menu-item">❤️ Wishlist</a>
          <a href="#" onclick="logoutUser()" class="menu-item" style="color:red;">🚪 Logout</a>
        </div>
      </div>
    `;
    
    // Adding dynamic styles for menu-item hover effect cleanly
    let style = document.createElement('style');
    style.innerHTML = `.menu-item { display:block; padding:12px; color:black; text-decoration:none; transition:0.3s; } .menu-item:hover { background:#f5f5f5; }`;
    document.head.appendChild(style);

  } else {
    area.innerHTML = `
      <div class="account-menu">
        <a href="javascript:void(0)" onclick="toggleAccountMenu()" style="color:white;text-decoration:none;">
          👤 Account
        </a>
        <div id="accountDropdown" class="account-dropdown" style="display:none;">
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

// Global click listener to close dropdowns when clicking outside
document.addEventListener("click", function (e) {
  // Close Account Menu
  if (!e.target.closest(".account-menu")) {
    let box = document.getElementById("accountDropdown");
    if (box) box.style.display = "none";
  }
  
  // Close User Menu
  let menu = document.getElementById("userMenu");
  if (menu && !e.target.closest(".user-menu-container")) {
    menu.style.opacity = "0";
    menu.style.transform = "translateY(15px) scale(0.96)";
    setTimeout(() => { menu.style.display = "none"; }, 300);
  }
});

// Run initially
showUserStatus();
updateCartCount();
