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
<img src="${p.image}" width="200">
<h3>${p.name}</h3>
</a>

<p>₹${p.price}</p>

</div>
`;

});

})
.catch(err => {
console.log("PRODUCT ERROR:", err);
});
