let product = {
name: "Cooking Pan",
price: 499,
description: "High quality non-stick pan for daily use",
image: "products/product1.jpg"
};

document.getElementById("pName").innerText = product.name;
document.getElementById("pPrice").innerText = "₹" + product.price;
document.getElementById("pDesc").innerText = product.description;

document.getElementById("mainImage").src = product.image;
