let allProducts = [];

// 🔥 LOAD PRODUCTS
fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res => res.json())
.then(data => {

allProducts = data; // save full data
showProducts(data);

})
.catch(err => {
console.log("PRODUCT ERROR:", err);
});


// 🔥 SHOW PRODUCTS
function showProducts(products){

let box = document.getElementById("productContainer");

if(!box) return;

box.innerHTML = "";

if(products.length === 0){
box.innerHTML = "<h3>No Product Found ❌</h3>";
return;
}

products.forEach(p => {

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

}


// 🔍 SEARCH FUNCTION
function searchProduct(){

let input = document.getElementById("searchInput").value.toLowerCase();

let filtered = allProducts.filter(p =>
p.name.toLowerCase().includes(input)
);

showProducts(filtered);

}
