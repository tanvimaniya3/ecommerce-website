let params = new URLSearchParams(window.location.search);
let id = params.get("id");

async function loadProduct(){

let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/products");
let data = await res.json();

// 🔥 id match fix (string compare)
let p = data.find(item => item._id.toString() === id);

if(!p){
alert("Product not found");
return;
}

// TEXT
document.getElementById("pName").innerText = p.name;
document.getElementById("pPrice").innerText = "₹" + p.price;
document.getElementById("pDesc").innerText = p.description || "No Description";

// IMAGE
document.getElementById("mainImage").src =
"https://ecommerce-website-pmr7.onrender.com/" + p.image;

}

loadProduct();
