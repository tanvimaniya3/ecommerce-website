fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res => res.json())
.then(data => {

let box = document.getElementById("productContainer");

if(!box) return;

box.innerHTML = "";

data.forEach(p => {

box.innerHTML += `
<div class="product">

<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-pmr7.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>

<p>₹${p.price}</p>

</div>
`;

});

updateCartCount();

});

// 🔥 CART COUNT
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