let params = new URLSearchParams(window.location.search);

let id = params.get("id");

fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res=>res.json())
.then(data=>{

let product = data.find(p => p._id == id || p.id == id);

document.getElementById("pImage").src = product.image;
document.getElementById("pName").innerText = product.name;
document.getElementById("pPrice").innerText = "₹" + product.price;

// 👉 important
window.currentProduct = product;

updateCartCount();

});


function addToCart(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// qty fix
cart.forEach(item=>{
if(!item.qty){
item.qty = 1;
}
});

// check existing
let existing = cart.find(p => (p._id == window.currentProduct._id));

if(existing){
existing.qty += 1;
}else{
window.currentProduct.qty = 1;
cart.push(window.currentProduct);
}

localStorage.setItem("cart", JSON.stringify(cart));

alert("Product Added To Cart");

updateCartCount();

}


// cart count update
function updateCartCount(){
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let badge = document.getElementById("cartCount");

if(badge){
badge.innerText = cart.length;
}
}
