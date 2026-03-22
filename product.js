let params = new URLSearchParams(window.location.search);
let id = params.get("id");

fetch("https://ecommerce-website-pmr7.onrender.com/api/products")
.then(res => res.json())
.then(data => {

let product = data.find(p => p._id == id);

if(!product){
alert("Product not found ❌");
return;
}

// ✅ SAFE rendering
document.getElementById("mainImage").src = product.image || "";
document.getElementById("pName").innerText = product.name || "";
document.getElementById("pPrice").innerText = "₹" + (product.price || 0);

})
.catch(err => {
console.log("DETAIL ERROR:", err);
});
