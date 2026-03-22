async function loadProduct(){

let res = await fetch("https://ecommerce-website-pmr7.onrender.com/api/products");
let data = await res.json();

// 👉 FIRST PRODUCT
let p = data[0];

if(!p){
alert("No product found");
return;
}

document.getElementById("pName").innerText = p.name;
document.getElementById("pPrice").innerText = "₹" + p.price;
document.getElementById("pDesc").innerText = p.description || "No Description";

document.getElementById("mainImage").src =
"https://ecommerce-website-pmr7.onrender.com/" + p.image;

}

loadProduct();
