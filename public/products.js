let allProducts = [];

fetch("https://ecommerce-website-1-s0j9.onrender.com/api/products")
.then(res => res.json())
.then(data => {
allProducts = data;
showProducts(data);
});

function showProducts(products){
let box = document.getElementById("productContainer");
if(!box) return;

box.innerHTML = "";

products.forEach(p => {
box.innerHTML += `
<div class="product">
<a href="product.html?id=${p._id}">
<img src="https://ecommerce-website-1-s0j9.onrender.com${p.image}" width="200">
<h3>${p.name}</h3>
</a>
<p>₹${p.price}</p>
</div>
`;
});
}

// 🔍 SEARCH
function searchProduct(){
let input = document.getElementById("searchInput").value.toLowerCase();

let filtered = allProducts.filter(p =>
p.name.toLowerCase().includes(input)
);

showProducts(filtered);
}
