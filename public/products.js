let allProducts = [];

// URL se search query aur filter check karna
let params = new URLSearchParams(window.location.search);
let searchQuery = params.get("search");

// 🔥 LOAD PRODUCTS (Optimized & Cached)
fetch("https://ecommerce-website-1-psvr.onrender.com/api/products")
  .then(res => res.json())
  .then(data => {
    allProducts = data;

    if (searchQuery) {
      let searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = searchQuery;
    }

    applyFilters();
  })
  .catch(err => console.error("Error loading products:", err));

// 🔥 SHOW PRODUCTS (Premium Look Injection)
function showProducts(products) {
  let box = document.getElementById("productContainer");
  if (!box) return;

  box.innerHTML = "";

  if (products.length === 0) {
    box.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center; padding: 40px;'>No Product Found ❌</h3>";
    return;
  }

  products.forEach(p => {
    if (p.visible === false) return;

    // 1. Dynamic Badge Selection
    let badgeHTML = "";
    if (p.bestSeller) {
      badgeHTML = `<span class="premium-badge badge-best">BEST SELLER</span>`;
    } else if (p.offerPrice && p.offerPrice < p.price) {
      badgeHTML = `<span class="premium-badge badge-hot">HOT DEAL</span>`;
    } else {
      badgeHTML = `<span class="premium-badge badge-new">NEW ARRIVAL</span>`;
    }

    // 2. Button Color Selection according to Category Accent color
    let btnClass = "btn-black";
    let categoryName = p.category ? p.category.toLowerCase() : "";
    
    if (categoryName === "furniture" || categoryName === "storage") {
      btnClass = "btn-olive";
    } else if (categoryName === "lighting" || categoryName === "appliances" || categoryName === "cookware") {
      btnClass = "btn-terracotta";
    }

    // 3. Stock Logic
    let buttonHTML = "";
    if (p.stock === false) {
      buttonHTML = `<button class="btn-disabled" disabled><span>Out of Stock</span> <span class="bag-icon">❌</span></button>`;
    } else {
      buttonHTML = `
        <button class="${btnClass}" onclick="addToCart('${p._id}')">
          <span>Add to Cart</span>
          <span class="bag-icon">🛍️</span>
        </button>
      `;
    }

    box.innerHTML += `
      <div class="premium-card">
          <div class="premium-image">
              ${badgeHTML}
              <span class="wishlist-btn" onclick="addToWishlist('${p._id}')">♡</span>
              <a href="product.html?id=${p._id}">
                <img src="${p.image.startsWith('http') ? p.image : 'https://ecommerce-website-1-psvr.onrender.com' + p.image}" alt="${p.name}">
              </a>
          </div>

          <div class="premium-content">
              <h3>${p.name}</h3>
              <p class="premium-category">${p.category || "Home Decor"}</p>
              
              <div class="premium-rating">
                ⭐⭐⭐⭐⭐ <span>(128)</span>
              </div>

              <div class="premium-price">
                  <span class="new-price">₹${(p.offerPrice || p.price).toLocaleString()}</span>
                  ${p.offerPrice ? `<span class="old-price">₹${p.price.toLocaleString()}</span>` : ""}
                  ${p.offerPrice ? `<span class="off-box">${Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF</span>` : ""}
              </div>

              ${buttonHTML}
          </div>
      </div>
    `;
  });
}

// 🔥 APPLY FILTERS
function applyFilters() {
  let searchInput = document.getElementById("searchInput");
  let search = searchInput ? searchInput.value.toLowerCase() : "";
  let category = document.getElementById("categoryFilter")?.value || "";
  let price = document.getElementById("priceFilter")?.value || "";
  let sort = document.getElementById("sortFilter")?.value || "";

  let suggestionBox = document.getElementById("suggestions");

  let filtered = allProducts.filter(p => {
    if (p.visible === false) return false;

    let matchSearch = p.name.toLowerCase().includes(search);
    let matchCategory = category === "" || (p.category && p.category.toLowerCase() === category.toLowerCase());

    let matchPrice = true;
    let finalPrice = p.offerPrice || p.price;

    if (price === "low") matchPrice = finalPrice < 500;
    else if (price === "mid") matchPrice = finalPrice >= 500 && finalPrice <= 2000;
    else if (price === "high") matchPrice = finalPrice > 2000;

    return matchSearch && matchCategory && matchPrice;
  });

  // SORT LOGIC
  if (sort === "low") {
    filtered.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
  } else if (sort === "high") {
    filtered.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
  }

  showProducts(filtered);

  // SUGGESTIONS DROP BOX
  if (suggestionBox) {
    suggestionBox.innerHTML = "";
    if (search.length > 0) {
      filtered.slice(0, 5).forEach(p => {
        suggestionBox.innerHTML += `
          <div onclick="goToProduct('${p._id}')" style="padding: 12px 20px; cursor:pointer; border-bottom:1px solid #f0f0f0; background: #fff; font-size: 14px;">
            🔍 ${p.name}
          </div>
        `;
      });
    }
  }
}

function goToProduct(id) {
  window.location.href = "product.html?id=" + id;
}

// 🔥 ADD TO CART (⚡ ULTRA FAST NO RE-FETCH)
function addToCart(id) {
  let product = allProducts.find(p => p._id == id);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(p => p._id == id);

  if (existing) {
    existing.qty += 1;
  } else {
    let cartItem = { ...product, qty: 1 };
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart 🛒 ✅");
  updateCartCount();
}

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

// Page initialization pe count automatic update karne ke liye
document.addEventListener("DOMContentLoaded", updateCartCount);
