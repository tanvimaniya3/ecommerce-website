let cart = JSON.parse(localStorage.getItem("cart")) || [];

let box = document.getElementById("cartItems");
let totalBox = document.getElementById("totalPrice");

function renderCart(){

box.innerHTML = "";

let total = 0;

cart.forEach((p,index)=>{

if(!p.qty){
p.qty = 1;
}

let price = Number(p.price);

total += price * p.qty;

box.innerHTML += `

<div>

<img src="${p.image}" width="100">

<h3>${p.name}</h3>

<p>₹${price}</p>

<button onclick="decreaseQty(${index})">-</button>

<span>${p.qty}</span>

<button onclick="increaseQty(${index})">+</button>

</div>

<hr>

`;

});

totalBox.innerText = total;

// cart count
let badge = document.getElementById("cartCount");
if(badge){
badge.innerText = cart.length;
}

localStorage.setItem("cart", JSON.stringify(cart));

}

function increaseQty(index){
cart[index].qty += 1;
renderCart();
}

function decreaseQty(index){
if(cart[index].qty > 1){
cart[index].qty -= 1;
}else{
cart.splice(index,1);
}
renderCart();
}

renderCart();